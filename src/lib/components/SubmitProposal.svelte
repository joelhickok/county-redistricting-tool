<script>
    import { saving} from '$lib/store.svelte.js'
    import {blockGeoJSON, planMeta, blocksLayer, districtColors} from '$lib/masterStore.svelte.ts';
    import {goto} from '$app/navigation'
    import axios from 'axios'
    import {onMount} from 'svelte'
    import {base} from '$app/paths'

    import ConfirmSave from '$lib/components/Modal.ConfirmSave.svelte'
    import ModalError from '$lib/components/ModalError.svelte'
    // import * as env from '$lib/env-vars'
    import getStyle from '$lib/get-style.js'
    import db from '$lib/client-database.js'

    let element
    // let tooltip
    let errorMessage = null
    let confirmSaveModalOpen = false

    const save = async () => {
        confirmSaveModalOpen = false
        $saving = true
        errorMessage = null

        const response = await axios.post(`${base}/api/save-proposal`, {
            features: blocksLayer.value.toGeoJSON().features,
            planMeta: planMeta.value,
        })

        console.warn('response')
        console.log(response)

        if (response.data.error) {
            console.log(response.data.message)
            errorMessage = response.data.message

            if (errorMessage.toLowerCase().includes('already exists')) {
                planMeta.value.name += ' 2'
            }
            // await goto(`/build`)
        } else if (response.data.itemId) {
            blocksLayer.value.eachLayer(layer => {
                layer.feature.properties.District = 0
                layer.setStyle(getStyle($districtColors, layer.feature.properties))
            })

            blockGeoJSON.value = [
                ...blocksLayer.value.toGeoJSON().features,
            ]

            await db.bulkPut(blockGeoJSON.value)
            planMeta.value = {}
            await goto(`${base}/existing?id=${response.data.itemId}`)
        }

        $saving = false
    }

    const showConfirm = (val) => {
        confirmSaveModalOpen = val
    }

    onMount(async () => {
        // const bootstrap = await import('bootstrap')
        // tooltip = new bootstrap.Tooltip(element, {})
    })
</script>

<!--{#if errorMessage}-->
<!--    <div class="card-body mb-0">-->
<!--        <div class="alert alert-danger mb-0">-->
<!--            {errorMessage || 'Fsdfdsfdss'}-->
<!--        </div>-->
<!--    </div>-->
<!--{/if}-->

<ConfirmSave bind:open={confirmSaveModalOpen} {save}/>

{#if errorMessage}
    <ModalError on:close={() => errorMessage = null}>
        {errorMessage}
    </ModalError>
{/if}

<div bind:this={element} class="flex-grow-1">
    <slot prop={showConfirm}></slot>
</div>
