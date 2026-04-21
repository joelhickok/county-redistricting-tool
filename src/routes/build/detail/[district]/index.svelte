<script>
    import orderBy from 'lodash-es/orderBy.js'
    import {page} from '$app/stores'
    import {summaryStatistics, blockGeoJSON, districtColors, blocksLayer,} from '$lib/masterStore.svelte';
    import {
        highlight,
        blockDetailLoading,
    } from '$lib/store.svelte'
    import {onMount} from 'svelte'
    import * as env from '$lib/env-vars'
    import getStyle from '$lib/get-style'
    import db from '$lib/client-database'
    import Icon from 'svelte-awesome'
    import {faExclamationTriangle as warn} from '@fortawesome/free-solid-svg-icons/faExclamationTriangle.js'

    let blocks = []
    let timeout
    let loading = true
    const base = env.BASE

    $: {
        if (blocksLayer.value && blockGeoJSON.value && blockGeoJSON.value.length) {
            $blockDetailLoading = true
            if (timeout) clearTimeout(timeout)
            blocks = []
            blocksLayer.value.eachLayer(layer => {
                if (Number(layer.feature.properties.District)
                    === Number($page.params.district)) {
                    blocks.push({
                        name: layer.feature.properties.GEOID20,
                        pop: layer.feature.properties.P0010001,
                        layer,
                    })
                }
            })
            blocks = [...orderBy(blocks, 'pop', 'desc')]
            $blockDetailLoading = false
        }
        $blockDetailLoading = false
    }

    const zoomTo = (layer) => {
        $highlight = layer.feature
    }

    const assignDistrict = async (block, district) => {
        console.log('assignDistrict')
        console.log(block, district)
        block.layer.feature.properties.District = Number(district)
        block.layer.setStyle(getStyle($districtColors, block.layer.feature.properties))
        blockGeoJSON.value = [
            ...blocksLayer.value.toGeoJSON().features,
        ]
        $highlight = null
        const result = await db.put(block.layer.feature)
        console.log('result (switched layer')
        console.log(result)
    }

    onMount(async () => {

    })
</script>

<div class="h-100 flex-grow-1 d-flex flex-column overflow-hidden">

    {#if blocks.length && Number(blocks[0].layer.feature.properties.P0010001) === 0}
        <div class="alert bg-warning">
            <div class="row">
                <div class="col-auto">
                    <Icon data={warn} scale="3"/>
                </div>
                <div class="col">
                    Even if blocks have a population of 0, they must all be assigned in order to propose your plan.
                </div>
            </div>
        </div>
    {/if}

    {#if $blockDetailLoading}
        <div class="card-body text-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <h3>Preparing district block selections...</h3>
        </div>
    {:else}
        <div class="card-body py-1">
            <div class="h5">
                There are {blocks.length} blocks in this group.
            </div>
            <h6 class="text-muted">Click an block row to view on the map.</h6>
        </div>

        <div class="list-group list-group-flush flex-grow-1 h-100 d-flex flex-column overflow-auto">
            <div class="list-group-item c-pointer">
                <div class="row justify-content-between align-items-center">
                    <div class="col">
                        Block GeoID
                    </div>
                    <div class="col">
                        Population
                    </div>
                    <div class="col">
                        Re-Assign District
                    </div>
                </div>
            </div>
            <div class="overflow-auto h-100 flex-grow-1">
                {#each blocks as block (block.name)}
                    <div class:bg-secondary={block.name === $highlight?.properties.GEOID20}
                         class="list-group-item list-group-item-action c-pointer justify-content-between align-items-center"
                         on:click={() => zoomTo(block.layer)}>
                        <div class="row justify-content-between align-items-center">
                            <div class="col">{block.name}</div>
                            <div class="col">{block.pop}</div>
                            <div class="col">
                                <select class="form-select bg-light d-inline"
                                        on:change={(e) => assignDistrict(block, e.target.value)}
                                        aria-label="Choose district for detail view">

                                    {#each Object.keys(summaryStatistics.value) as key}
                                        <option value="{Number(key)}">
                                            {#if Number(key) === 0}
                                                Unassigned
                                            {:else}
                                                District {key}
                                            {/if}
                                        </option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}

    <slot/>

</div>
