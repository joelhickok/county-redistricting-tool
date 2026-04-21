<script>
    import {onMount} from 'svelte'
    import {goto} from '$app/navigation'
    import {base} from '$app/paths'

    // local imports
    import Header from 'src/routes/build/_Header.svelte'
    import Nav from './_Nav.svelte'
    import { displayName} from '$lib/store.svelte'
    import {blockGeoJSON, planMeta} from '$lib/masterStore.svelte.ts';

    // import * as env from '$lib/env-vars'
    import db from '$lib/client-database'

    // const base = env.BASE
    let loading

    $: $displayName = planMeta.value.name || 'Unnamed Proposal'

    onMount(async () => {
        if (!planMeta?.value.id) {
            loading = false
            await goto(`${base}/create`)
        }

        const response = await db.bulkGet().catch(err => err)
        blockGeoJSON.value = [...response,]

        // if (overlays.value['Working Proposal'] && !overlays.value['Working Proposal'].visible) {
        //     overlays.value['Working Proposal'].visible = true
        // }
    })
</script>

<div class="h-100 d-flex flex-column flex-grow-1 overflow-hidden">
    <Header/>

    <div class="card-header pt-2 mb-1">
        <Nav/>
    </div>

    <div class="card-body flex-grow-1 d-flex flex-column h-100 overflow-auto">
        {#if loading}
            <div class="alert alert-info m-2">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="spinner-border spinner-border-sm" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    <div class="col">
                        <h6 class="my-0">
                            Please Wait.
                        </h6>
                        <h6 class="my-0">
                            We're reloading your working district proposal...
                        </h6>
                    </div>
                </div>
            </div>
        {:else}
            <slot/>
        {/if}
    </div>

</div>
