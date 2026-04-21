<script>
    // import {createEventDispatcher} from 'svelte'
    // const dispatch = createEventDispatcher()
    import PlanMeta from '$lib/components/PlanMeta.svelte'

    import {onDestroy, onMount} from 'svelte'
    import {warnings, planMeta} from '$lib/masterStore.svelte.ts';

    export let open
    export let save
    let element
    let myModal

    $: if (myModal && open) {
        myModal.show()
    } else if (myModal) {
        myModal.hide()
    }

    const startSave = () => {
        open = false
        save()
    }

    onMount(async () => {
        const bootstrap = await import('bootstrap')
        myModal = new bootstrap.Modal(element, {})
        myModal.show()

        element.addEventListener('hidden.bs.modal', function () {
            open = false
        })
    })

    onDestroy(() => {
        if (myModal) {
            myModal.hide()
        }
    })
</script>

<div class="modal"
     bind:this={element}
     tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content text-black">
            <div class="modal-header">
                <h5 class="modal-title text-black">
                    Confirm and Submit Proposal
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

                {#if warnings.value.excessiveDeviation || warnings.value.unassignedBlocksPresent}

                    {#if warnings.value.excessiveDeviation}
                        <div class="alert alert-danger">
                            Your population deviation between districts is greater than 10%.
                            Please decrease the deviation by making the total population
                            of each district more equal.
                        </div>
                    {:else if warnings.value.unassignedBlocksPresent}
                        <div class="alert alert-danger">
                            There are unassigned blocks that must be assigned to submit your proposal.
                            You must assign all bocks, even if 0 population.
                        </div>
                    {/if}

                {:else}
                    <PlanMeta/>

                    <p class="mb-0">
                        Are you ready to finish and upload your Proposal to Mono County?
                    </p>

                    <h3 class="mt-2 text-danger">
                        Demo only.  Submission is disabled.
                    </h3>
                {/if}

            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal"
                        on:click={() => open = false}>Cancel
                </button>
                <button type="button" class="btn btn-primary"
                        style="min-width: 150px;"
                        disabled={true || !planMeta.value.name || warnings.value.unassignedBlocksPresent || warnings.value.excessiveDeviation}
                        on:click={() => startSave()}>Save
                </button>
            </div>

        </div>
    </div>
</div>
