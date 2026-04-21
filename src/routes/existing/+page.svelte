<script lang="ts">
    import {onMount, onDestroy} from 'svelte'
    import {format} from 'date-fns/format'
    import orderBy from 'lodash-es/orderBy'
    import {queryFeatures} from '@esri/arcgis-rest-feature-service'
    import {ArcGISIdentityManager} from '@esri/arcgis-rest-request'
    // import Icon from 'svelte-awesome'
    import {faExclamationCircle as empty} from '@fortawesome/free-solid-svg-icons'
    import {page} from '$app/state'
    import type {PageProps} from './$types'
    import {currentExistingProposal,} from '$lib/store.svelte'
    import {blockGeoJSON, displayName, planMeta, overlays} from '$lib/masterStore.svelte'
    import type {IItem} from '@esri/arcgis-rest-portal'
    import {env} from '$env/dynamic/private'
    import MdiAlarmOff from 'virtual:icons/mdi/alarm-off'


    let {data}: PageProps = $props()

    let loading: any = {}

    console.log(page.url.searchParams.get('id'))
    const id = $state(page.url.searchParams.get('id') || null)

    const loadLayer = async (item: IItem) => {
        if (item.id === id) return

        const authentication = await ArcGISIdentityManager.signIn({
            username: env.ARCGIS_USERNAME,
            password: env.ARCGIS_PASSWORD,
        })

        displayName.value = item.title

        // if (overlays.value['Working Proposal']) {
        //     overlays.value['Working Proposal'].visible = true
        // }

        page.url.searchParams.set('id', item.id)

        // $currentExistingProposal = item.url + '/0'
        loading[item.id] = true
        const response = await queryFeatures({
            url: item.url + '/0',
            authentication,
            f: 'geojson',
            geometryPrecision: 4,
            outSR: '4326',
        }).catch(err => err)
        blockGeoJSON.value = [
            ...response.features
        ]
        loading[item.id] = false
    }

    onMount(() => {
        if (id) {
            const current = data.items.find((item: IItem) => item.id === id)
            loadLayer(current)
        } else {
            $currentExistingProposal = null
        }
    })

    onDestroy(async () => {
        $currentExistingProposal = null
        overlays.value['Existing Proposal']
    })
</script>

<div class="container h-100 py-2 flex-grow-1 d-flex flex-column">

    <h3>Existing Proposals</h3>

    <hr>

    {#if data.items && !data.items.length}
        <div class="card">
            <div class="card-body text-center">

                <div>
                    <!--                    <Icon data={empty} scale={3.0}/>-->
                    <MdiAlarmOff />
                </div>

                <h5>
                    There are no existing proposals.
                </h5>

                {#if planMeta.value?.id}
                    <p>Finish and save your proposal or create a new one.</p>
                {/if}

                <a class="btn btn-outline-dark w-100 mt-4" href="/create">
                    Create New Proposal
                </a>
            </div>
        </div>
    {/if}

    <div class="flex-grow-1 overflow-auto h-100">

        {#each orderBy(data.items, 'created', 'desc') as item}
            <div class="card mb-2">

                <div class="card-header bg-secondary"
                     class:bg-success={id === item.id}
                     class:text-white={id === item.id}
                >
                    <div class="float-end mt-2"
                         style="font-size: 9pt;">
                        Created: {format(new Date(item.created), 'MM/dd/yyyy h:mm aa')}
                    </div>

                    <div class="">{item.title}</div>
                </div>

                <div class="card-body">
                    <div>
                        {@html item.description || ''}
                    </div>

                    <div class="row g-1 mt-1">
                        <div class="col">
                            <button class="btn btn-dark btn-sm w-100"
                                    disabled={loading[item.id]}
                                    onclick={() => loadLayer(item)}>
                                {#if loading[item.id]}
                                    <div class="spinner-border spinner-border-sm" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                    Loading Proposal
                                {:else}
                                    Preview Proposal
                                {/if}
                            </button>
                        </div>
                        <div class="col">
                            <a class="btn btn-light btn-sm  w-100"
                               href="/create?name={item.name}">
                                Use For New Proposal
                            </a>
                        </div>

                        <!--                        <div class="col-auto">-->

                        <!--                            <div class="dropdown">-->
                        <!--                                <button class="btn btn-outline-dark btn-sm dropdown-toggle w-100"-->
                        <!--                                        type="button"-->
                        <!--                                        id="dropdownMenuButton1"-->
                        <!--                                        data-bs-toggle="dropdown"-->
                        <!--                                        aria-expanded="false">-->
                        <!--                                    Admin-->
                        <!--                                </button>-->
                        <!--                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">-->
                        <!--                                    <li>-->
                        <!--                                        <a class="dropdown-item"-->
                        <!--                                           href="https://monomammoth.maps.arcgis.com/apps/mapviewer/index.html?layers={item.id}"-->
                        <!--                                           target="_blank">-->
                        <!--                                            AGOL Map-->
                        <!--                                        </a>-->
                        <!--                                    </li>-->
                        <!--                                    <li>-->
                        <!--                                        <a class="dropdown-item"-->
                        <!--                                           href="https://monomammoth.maps.arcgis.com/home/item.html?id={item.id}"-->
                        <!--                                           target="_blank">-->
                        <!--                                            AGOL Item-->
                        <!--                                        </a>-->
                        <!--                                    </li>-->
                        <!--                                </ul>-->
                        <!--                            </div>-->

                        <!--                        </div>-->

                    </div>
                </div>

            </div>
        {/each}

    </div>

</div>

