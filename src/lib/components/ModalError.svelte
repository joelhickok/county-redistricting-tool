<script>
    import {onDestroy, onMount} from 'svelte'
    import {createEventDispatcher} from 'svelte'
    const dispatch = createEventDispatcher()

    let modal
    let element

    onMount(async () => {
        const {Modal} = await import('bootstrap')
        modal = new Modal(element, {})
        modal.show()
    })

    onDestroy(() => {
        if (modal) {
            modal.hide()
        }
    })
</script>

<div bind:this={element} class="modal" tabindex="-1">

    <div class="modal-dialog">

        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title text-black">
                    Error
                </h5>
            </div>

            <div class="modal-body text-black">

                <div class="alert alert-warning">
                    <slot/>
                </div>

                <p>
                    An attempt as been made to capture this error, but if this error persists please provide
                    support@mono.ca.gov with a notification, or even a clarifying screenshot.
                </p>
            </div>

            <div class="modal-footer">
                <button class="btn btn-danger" on:click={() => dispatch('close')}>
                    Close
                </button>
            </div>

        </div>

    </div>

</div>
