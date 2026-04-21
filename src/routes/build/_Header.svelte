<script>
    import axios from 'axios'
    import Icon from 'svelte-awesome'
    import {faSave as saveIcon} from '@fortawesome/free-solid-svg-icons/faSave.js'
    import {faRedo as resetIcon} from '@fortawesome/free-solid-svg-icons/faRedo.js'
    import {faQuestion as help} from '@fortawesome/free-solid-svg-icons/faQuestion.js'

    import Modal from 'components/Modal.svelte'
    import SubmitProposal from 'components/SubmitProposal.svelte'

    import {
        saving,
    } from '$lib/store.svelte'
    import {goto} from '$app/navigation'
    import * as env from '$lib/env-vars'
    import getStyle from '$lib/get-style'
    import db from '$lib/client-database'
    import {blockGeoJSON, districtColors, blocksLayer,} from '$lib/masterStore.svelte.ts';

    let confirmReset = false
    let resetInProgress = false

    const reset = async () => {
        console.log('reset')
        resetInProgress = true
        blocksLayer.value.eachLayer(layer => {
            layer.feature.properties.District = 0
            layer.setStyle(getStyle($districtColors, layer.feature.properties))
        })

        blockGeoJSON.value = [
            ...blocksLayer.value.toGeoJSON().features,
        ]

        await db.bulkPut(blockGeoJSON.value)
        confirmReset = false
        resetInProgress = false
    }

</script>

{#if confirmReset}
    <Modal bind:open={confirmReset}>
        <div slot="title">Reset Entire Proposal</div>
        You are about to reset the entire proposal, including all blocks. Are you sure?
        <div slot="footer">
            <button class="btn btn-outline-dark btn-sm"
                    on:click={() => confirmReset = false}>
                Cancel
            </button>
            <button class="btn btn-info btn-sm"
                    style="min-width: 100px;"
                    disabled={resetInProgress}
                    on:click|stopPropagation={() => reset()}>
                Yes
                {#if resetInProgress}
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span class="visually-hidden">Loading...</span>
                {/if}
            </button>
        </div>
    </Modal>
{/if}

<div class="card-header page-header row align-items-center">
    <div class="col">
        <div class="h5 m-0 p-0">My Working Proposal</div>
    </div>
    <div class="col col-auto">

        <div class="btn-group" role="group" aria-label="Basic example">

            <button type="button"
                    class="btn btn-dark btn-sm"
                    on:click={() => confirmReset = true}
                    disabled={$saving}
            >
                <Icon data={resetIcon} scale="0.8"/>
                Reset Proposal
            </button>

<!--            <button class="btn btn-dark btn-sm"-->
<!--                    aria-current="page"-->
<!--                    on:click={() => $firstTime = true}>-->
<!--                <Icon data={help} scale="0.8"/>-->
<!--                Help-->
<!--            </button>-->

            <!--            <SubmitProposal let:prop={showConfirm}>-->
            <!--                <button type="button"-->
            <!--                        class="btn btn-dark btn-sm"-->
            <!--                        on:click={showConfirm(true)}>-->
            <!--                    <Icon data={saveIcon} scale="1"/>-->
            <!--                    Submit Proposal-->
            <!--                </button>-->
            <!--            </SubmitProposal>-->

        </div>

    </div>

</div>
