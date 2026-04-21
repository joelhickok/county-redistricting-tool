<script>
    import {onMount} from 'svelte'
    import {summaryStatistics, currentDistrict} from '$lib/masterStore.svelte.js'

    onMount(() => {
        document.addEventListener('keypress', (e) => {
            if ([0, 1, 2, 3, 4, 5].includes(Number(e.key))) {
                currentDistrict.value = Number(e.key)
            }
        })
    })
</script>

<div class="px-2 pt-1 mb-1">
    <div class="text-center h5 my-0 py-0">
        Current District Selection
        <small class="text-muted">Press 1-5 on keyboard to switch</small>
    </div>

    <div class="row g-1"
         role="group"
         aria-label="Select districts">
        {#each Object.keys(summaryStatistics.value) as key}
            <div class="col position-relative"
                 class:active={currentDistrict.value === Number(key)}
            >
                <input bind:group={currentDistrict.value}
                       value={Number(key)}
                       type="radio"
                       class="btn-check"
                       name="btnradio"
                       id="btnradio{key}"
                       autocomplete="off">
                <label
                        class="btn w-100 primary-{key}"
                        for="btnradio{key}">
                    <span class="h5 py-0 my-0">
                        {#if Number(key) === 0}
                            Unassigned
                        {:else}
                            {key}
                        {/if}
                    </span>
                </label>
            </div>
        {/each}
    </div>
</div>

<style>
    .active {
        border-bottom: 6px solid black;
        padding-bottom: 3px;
    }
</style>
