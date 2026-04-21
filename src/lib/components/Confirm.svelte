<script>
    import {onMount, createEventDispatcher} from 'svelte'
    import ModalTemplate from 'components/ModalTemplate.svelte'


    onMount(() => {
        console.log(`..._> Mounted Confirm Modal`)
    })

</script>

<ModalTemplate>
    <h4 slot="title">Please Confirm</h4>

    <slot>
        Do you want to take this action?
    </slot>

    <div slot="footer">
        <div class=" d-flex flex-fill">

            <button class="btn btn-outline-dark btn-sm w-50">
                Cancel
            </button>

            <div style="min-width: 10px;"></div>

            <button class="btn btn-info btn-sm w-50"
            on:click|stopPropagation={() => dispatch('confirm', true)}>
                Yes
            </button>

        </div>
    </div>
</ModalTemplate>
