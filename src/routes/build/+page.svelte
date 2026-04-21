<script>
    import PlanMeta from '$lib/components/PlanMeta.svelte'
    import {classBreakInfos} from '$lib/masterStore.svelte.ts';

    import {base} from '$app/paths'

</script>

<div class="container h-100 d-flex flex-column flex-grow-1 overflow-hidden">

    <p class="my-2 flex-shrink-1">
        This is your working plan. To complete it, ensure there are no
        unassigned blocks and keep the population deviation under 10%. Then Submit the proposal.
    </p>

    <PlanMeta/>

    <a href="{base}/build/overview" class="mt-4 btn btn-info btn-lg w-100">
        Start Assigning Blocks
    </a>

<!--    <pre>{JSON.stringify(Object.keys(overlays.value), null, 2)}</pre>-->
<!--    <pre>{JSON.stringify(Object.keys($classBreakInfos), null, 2)}</pre>-->
</div>

<slot/>
