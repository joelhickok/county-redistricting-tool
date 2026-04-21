<script>
    import Icon from 'svelte-awesome'
    import {faQuestion as help} from '@fortawesome/free-solid-svg-icons/faQuestion'
    import {faPlusSquare as create} from '@fortawesome/free-solid-svg-icons/faPlusSquare'
    import {base} from '$app/paths'

    import {firstTime} from '$lib/masterStore.svelte.js'
</script>

<div class="container">
    <h2>Redistricting Tool</h2>

    <h5 class="text-justify text-muted">
        Welcome! This is a tool provided by Mono County for the purpose of creating new District proposals.
    </h5>

    <div class="alert alert-warning">
        Public submissions will close on November 8, 2021 at 5pm.
    </div>

    <hr>

    <h5 class="text-info">Some basic instructions:</h5>

    <div class="alert alert-info">
        Use this tool to build and propose a redistricting plan in Mono County.
    </div>

    <ol>
        <li>
            Your proposal is automatically saved in your browser. Don't worry about losing it unless you reset it on
            purpose. This will <span class="text-decoration-underline">NOT</span> carry over in-between other web
            browsers on your computer, or between alternative
            computers.
        </li>

        <li>
            You cannot submit a proposal that does not meet the legal criteria.
        </li>
    </ol>

    <div class="row">
        <div class="col">
            <button class="btn btn-info btn-lg w-100"
                    aria-current="page"
                    on:click={() => firstTime.value = true}>
                <Icon data={help}/>
                View Help
            </button>
        </div>
        <div class="col">
            <a href="{base}/create" class="btn bg-secondary w-100 btn-lg">
                <Icon data={create}/>
                Create New Proposal
            </a>
        </div>
    </div>
</div>
