<script>
    import {onDestroy, onMount} from 'svelte'

    export let open = false
    let modal
    let element

    onMount(async () => {
        const {Modal} = await import('bootstrap')
        modal = new Modal(element, {})
        modal.show()
        element.addEventListener('hide.bs.modal', () => {
            open = false
        })
    })

    onDestroy(() => {
        if (modal) {
            modal.hide()
            modal.dispose()
        }
    })
</script>

<div bind:this={element} class="modal" tabindex="-1">

    <div class="modal-dialog">

        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">
                    <slot name="title"/>
                </h5>
            </div>

            <div class="modal-body">
                <slot/>
            </div>

            <div class="modal-footer">
                <slot name="footer"/>
            </div>

        </div>

    </div>

</div>
