<script>
    import {onDestroy, onMount} from 'svelte'
    import {firstTime} from '$lib/masterStore.svelte.ts'

    export let open
    let modal
    let element

    const close = () => {
        firstTime.value = false
        open = false
        modal.hide()
    }

    onMount(async () => {
        const bootstrap = await import('bootstrap')
        modal = new bootstrap.Modal(element, {})
        modal.show()

        element.addEventListener('hide.bs.modal', () => {
            firstTime.value = false
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

    <div class="modal-dialog modal-lg">

        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">
                    <slot name="title"/>
                </h5>
            </div>

            <div class="modal-body">

                <div class="alert alert-info mb-1">
                    Use this tool to build and propose a redistricting plan in Mono County.
                </div>

                <div class="alert alert-warning">
                    Public submissions will close on November 8, 2021 at 5pm.
                </div>

                <h6>Quick Notes:</h6>

                <ol class="">
                    <li>
                        Your proposal is automatically saved in your browser. Don't worry about losing it unless you
                        reset it on
                        purpose. This will <span class="text-decoration-underline">NOT</span> carry over in-between
                        other web browsers on your computer, or between alternative
                        computers.
                    </li>

                    <li>
                        You cannot submit a proposal that does not meet the legal criteria.
                    </li>
                </ol>

                <div class="row">
                    <div class="col">
                        <a class="btn btn-info text-white w-100"
                                href="https://webapps.mono.ca.gov/documents/Redistricting/Redistricting%20App%20Documentation.pdf"
                                target="_blank"
                        >
                            View Documentation
                        </a>
                    </div>
                    <div class="col">
                        <a class="btn btn-info text-white w-100"
                                href="https://youtu.be/vxsR9xjbRhY"
                                target="_blank"
                        >
                            Instructional Video
                        </a>
                        <div class="mt-2 text-center">
                            <div class="small">Subtítulos en español disponibles a través de YouTube.</div>
                            <div class="small">Spanish captions available via YouTube.</div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="modal-footer">
                <button class="btn btn-success text-white" on:click={close}>
                    Close
                </button>
            </div>

        </div>

    </div>

</div>

<slot/>
