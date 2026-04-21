<script>
    import {
        summaryStatistics,
        warnings,
        mapState,
        blockGeoJSON,
        districtColors,
        blocksLayer,
        deviation,
    } from '$lib/masterStore.svelte.js';

    import {onMount, onDestroy} from 'svelte'
    import getStyle from '$lib/get-style'
    import db from '$lib/client-database'
    import Icon from 'svelte-awesome'
    import {faExclamationCircle as warn} from '@fortawesome/free-solid-svg-icons/faExclamationCircle'
    import {faCheckCircle as good} from '@fortawesome/free-solid-svg-icons/faCheckCircle'
    import {faSave as saveIcon} from '@fortawesome/free-solid-svg-icons/faSave'
    import {base} from '$app/paths'
    import Modal from '$lib/components/Modal.svelte';
    import DistrictDash from '$lib/components/DistrictDash.svelte';
    import SubmitProposal from '$lib/components/SubmitProposal.svelte';

    let clearConfirmOpen = false
    let clearDistrict = null

    const confirmClear = async (e) => {
        clearConfirmOpen = true
        clearDistrict = e.detail
    }

    const clear = async (district) => {
        mapState.working = true
        blocksLayer.value.eachLayer(layer => {
            if (Number(layer.feature.properties.District) === Number(district)) {
                layer.feature.properties.District = 0
                layer.setStyle(getStyle($districtColors, layer.feature.properties))
            }
        })
        blockGeoJSON.value = [
            ...blocksLayer.value.toGeoJSON().features,
        ]
        await db.bulkPut(blockGeoJSON.value)
        mapState.working = false
        clearDistrict = null
        clearConfirmOpen = false
    }

    onMount(async () => {
    })
</script>

<div class="position-relative flex-grow-1 h-100 d-flex flex-column overflow-x-hidden overflow-y-auto">

    {#if clearConfirmOpen}
        <Modal bind:open={clearConfirmOpen}>
            <div slot="title">Confirm Clear District</div>
            Are you sure you want to clear all block assignments
            for <span style="font-weight: bold;">District {clearDistrict}</span>?
            <div slot="footer">
                <button class="btn btn-outline-dark btn-sm" on:click={() => clearConfirmOpen = false}>
                    Cancel
                </button>
                <button class="btn btn-info btn-sm"
                        disabled="{mapState.working}"
                        style="min-width: 100px;"
                        on:click|stopPropagation={() => clear(clearDistrict)}>
                    Yes
                    {#if mapState.working}
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span class="visually-hidden">Loading...</span>
                    {/if}
                </button>
            </div>
        </Modal>
    {/if}

    <div class="flex-grow-1 d-flex flex-column">

        {#each Object.keys(summaryStatistics.value) as key}
            {#if Number(key) !== 0}
                <div class="mb-1">
                    <DistrictDash district={key}
                                  on:clear-district={confirmClear}
                                  properties={summaryStatistics.value[key]}/>
                </div>
            {/if}
        {/each}
    </div>

    <h5 class="text-center mt-2 bg-light py-1">Requirements for Submission:</h5>

    <div class="flex-shrink-1 h-100">

        <div class="row">
            <div class="col">
                <div class="card h-100">
                    <div class="card-header bg-success text-white"
                         style="color: white !important;"
                         class:bg-danger={warnings.value.excessiveDeviation}
                         class:text-white={warnings.value.excessiveDeviation}
                    >
                        <div class="float-end">
                            {#if warnings.value.excessiveDeviation}
                                <Icon data={warn}/>
                            {:else}
                                <Icon data={good}/>
                            {/if}
                        </div>
                        Deviation &#x3c; 10%
                    </div>
                    <div class="card-body py-1">
                        <h3>{deviation.value.totalDeviation.toFixed(1)}%</h3>
                        {#if warnings.value.excessiveDeviation}
                            Deviation is out of range
                        {/if}
                    </div>
                </div>
            </div>

            <div class="col">
                <div class="card h-100">
                    <div class="card-header bg-success text-white"
                         style="color: white !important;"
                         class:bg-danger={warnings.value.unassignedBlocksPresent}
                         class:text-white={warnings.value.unassignedBlocksPresent}
                    >
                        <div class="float-end">
                            {#if warnings.value.unassignedBlocksPresent}
                                <Icon data={warn}/>
                            {:else}
                                <Icon data={good}/>
                            {/if}
                        </div>
                        Unassigned Blocks
                    </div>
                    <div class="card-body py-1">
                        {#if warnings.value.unassignedBlocksPresent}
                            <a class="btn btn-outline-dark btn-sm mt-2 mb-1 float-end"
                               href="{base}/build/detail/0">
                                Resolve
                            </a>
                            <div>
                                {derivedStore.blocksByDistrictGroup[0]?.length}  blocks to assign.
                            </div>
                            <div>
                                {summaryStatistics.value[0].population} population left to assign.
                            </div>
                        {:else}
                            You assigned all blocks.
                        {/if}
                    </div>
                </div>
            </div>
        </div>

    </div>

    <div class="flex-grow-1 bg-danger d-flex flex-column mt-2">
        <SubmitProposal let:prop={showConfirm}>
            <button type="button"
                    class="btn btn-dark w-100 h-100"
                    on:click={() => showConfirm(true)}>
                <Icon data={saveIcon} scale="1"/>
                Submit Proposal
            </button>
        </SubmitProposal>
    </div>
</div>

<slot/>
