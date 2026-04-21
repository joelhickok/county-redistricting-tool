<script>
    import {onMount} from 'svelte'
    import axios from 'axios'
    import {formatISO} from 'date-fns/formatISO'
    import {center, tag} from '@turf/turf'
    import {queryFeatures} from '@esri/arcgis-rest-feature-service'
    import ShortUniqueId from 'short-unique-id'
    import {goto} from '$app/navigation'
    import {page,} from '$app/stores'
    import Modal from '$lib/components/Modal.svelte'

    import {planMeta, blockGeoJSON} from '$lib/masterStore.svelte.js';
    import db from '$lib/client-database'

    let loading = false
    let confirm = {
        open: false,
    }
    const uid = new ShortUniqueId({length: 10})

    const openConfirm = (callback) => {
        if (planMeta?.value?.id && blockGeoJSON.blocksByDistrictGroup && blockGeoJSON.blocksByDistrictGroup[0]?.length < 1402) {
            confirm = {
                open: true,
                callback,
            }
        } else {
            callback()
        }

    }

    const getFeatureFromExisting = (layerName = 'Mono_County_2020_Block_Demographics', simplify = true) => {
        if (!layerName) {
            alert('No existing name provided.')
            return
        }

        const url = `/api/get-template`
        console.log(url)

        return axios.get(url, {
            params: {
                name: layerName,
                simplify,
            }
        })
            .then(res => {
                console.log(res)
                return res.data
            })
            .catch(err => err)
    }

    const proposalFromExistingProposal = async (layerName, simplify = false) => {
        console.log('proposalFromExistingProposal')

        // if ($planMeta?.id && blocksByDistrictGroup.value[0]?.length === 1402) {
        //     alert('Your current proposal has no blocks assigned.  No need to create a new Proposal.')
        //     return
        // }

        if (confirm.open) confirm.open = false
        loading = true
        const existing = await getFeatureFromExisting(layerName, simplify)
        console.log(existing)
        await buildClientDatabase(existing.features)
        loading = false
    }

    const proposalFromExistingDistricts = async (layerName = 'Mono_County_2020_Block_Demographics', simplify = true) => {
        console.log('proposalFromExistingDistricts')
        if (confirm.open) confirm.open = false
        loading = true
        const existing = await getFeatureFromExisting(layerName, simplify)
        console.log(existing)

        const getDistricts = queryFeatures({
            url: 'https://gis.mono.ca.gov/webgis/rest/services/OpenData/Districts/MapServer/20',
            // params: {
            f: 'geojson',
            // },
        })
            .then(res => {
                console.log(res)
                return res
            })
            .catch(err => {
                console.log('error getting Districts')
                console.log(err)
            })

        console.log('getDistricts')
        console.log(getDistricts)

        const promises = await Promise.all([existing, getDistricts])

        console.log('promises')
        console.log(promises)

        const template = promises[0]
        const districts = promises[1]

        template.features.forEach((feature, index, arr) => {
            const centerPoint = center(feature)
            const r = tag(centerPoint, districts, 'District', 'dist')
            if (!r.properties.dist) {
                arr[index].properties.District = 0
            } else {
                arr[index].properties.District = Number(r.properties.dist)
            }
        })

        console.log(template.features)

        await buildClientDatabase(template.features)

        loading = false
    }

    const buildClientDatabase = async (features) => {
        await db.createProposalTables().catch(err => err)

        await db.createProposalTables().catch(err => err)

        planMeta.value = {
            id: uid.rnd(),
        }

        await db.addMeta(planMeta.value).catch(err => err)

        blockGeoJSON.value = [
            ...features
        ]

        const response = await db.bulkAdd(blockGeoJSON.value).catch(err => err)

        if (response.error || response.message) {
            console.log(response.message)
        }

        await goto(`/build`)
    }

    if ($page.url.searchParams.get('name')) {
        console.log(`Loading proposal named ${$page.url.searchParams.get('name')}`)
        proposalFromExistingProposal($page.url.searchParams.get('name'))
    }

    if ($page.url.searchParams.get('new')) {
        console.log(`Creating a new proposal based on URL param`)
        proposalFromExistingProposal()
    }
</script>

{#if confirm && confirm.open}
    <Modal>
        <div slot="title">Clear Current Proposal</div>
        Your current proposal will be lost if you create a new propoal.
        <div slot="footer">
            <button class="btn btn-outline-dark btn-sm"
                    on:click={() => confirm.open = false}
            >
                Cancel
            </button>
            <button class="btn btn-info btn-sm"
                    style="min-width: 100px;"
                    disabled={loading}
                    on:click|stopPropagation={() => confirm.callback()}>
                Continue
                {#if loading}
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span class="visually-hidden">Loading...</span>
                {/if}
            </button>
        </div>
    </Modal>
{/if}

<div class="d-flex flex-column">
    <div class="card-body flex-shrink-1">
        <h3 class="text-info">Create New District Proposal</h3>

        <div class="h5">
            Select one of the different ways to create a new proposal from the choices below:
        </div>

        {#if loading}
            <div class="card">
                <div class="card-body text-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <h3>Creating proposal...</h3>
                </div>
            </div>
        {:else}
            <button class="btn btn-secondary w-100 mb-2"
                    class:disabled="{loading}"
                    on:click={() => openConfirm(proposalFromExistingProposal)}>
                Brand New From Scratch
            </button>

            <button class="btn btn-secondary w-100 mb-2"
                    class:disabled="{loading}"
                    on:click={() => openConfirm(proposalFromExistingDistricts)}>
                Using Current Districts
            </button>

            <a class="btn btn-secondary w-100 mb-2"
               href="/existing"
               class:disabled="{loading}">
                From An Existing Proposal
            </a>

            {#if planMeta?.value?.id}
                <a class="btn btn-success text-white w-100 mb-2"
                   href="/build"
                   class:disabled="{loading}">
                    Resume Working Proposal
                </a>

            {/if}
        {/if}

        <!--        <pre>{JSON.stringify($planMeta.id, null, 2)}</pre>-->

    </div>

</div>

<slot/>
