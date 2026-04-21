<script>
    import {saving} from '$lib/store.svelte.js'

</script>

{#if saving}
    <div id="myModal" class="modal-local">

        <!-- Modal content -->
        <div class="modal-content-local text-white text-center">

            <div class="spinner-border spinner-border" role="status"
                 style="color: yellow;">
                <span class="visually-hidden">Loading...</span>
            </div>

            <h4 style="color: yellow;">Saving Your Proposal</h4>

            <p>
                Please be patient and do not close this window.
            </p>

            <p>
                The process can take a few minutes on a slower Internet connection.
            </p>
        </div>

    </div>
{/if}

<style>
    .modal-local {
        display: block; /* Hidden by default */
        position: fixed; /* Stay in place */
        z-index: 99999; /* Sit on top */
        left: 0;
        top: 0;
        width: 100vw; /* Full width */
        height: 100vh; /* Full height */
        overflow: auto; /* Enable scroll if needed */
        background-color: rgb(0, 0, 0); /* Fallback color */
        background-color: rgba(0, 0, 0, 0.85); /* Black w/ opacity */
    }

    /* Modal Content/Box */
    .modal-content-local {
        /*background-color: #fefefe;*/
        margin: 15% auto; /* 15% from the top and centered */
        padding: 20px;
        /*border: 1px solid #888;*/
        width: 80%; /* Could be more or less, depending on screen size */
    }
</style>
