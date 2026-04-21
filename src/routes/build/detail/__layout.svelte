<script>
    import {summaryStatistics} from '$lib/masterStore.svelte.js'
    import {blockDetailLoading} from '$lib/store.svelte'
    import {goto} from '$app/navigation'
    import {page} from '$app/stores'
    import {base} from '$app/paths'

    let currentBlock = $page.params.district ? Number($page.params.district) : 0

    const switchCurrentDetail = () => {
        $blockDetailLoading = true
        goto(`${base}/build/detail/${currentBlock}`)
    }
</script>

{#if summaryStatistics.value}
    <div class="card-body mb-0 pb-0 flex-shrink-1">
        <div class="row align-items-center">

            <div class="col-auto">
                <div class="h6 my-0 py-0">Block Breakdown For:</div>
            </div>

            <div class="col">

                <select class="form-select bg-light"
                        bind:value={currentBlock}
                        on:change={switchCurrentDetail}
                        aria-label="Choose district for detail view">

                    <option disabled>Choose district for detail view:</option>

                    {#each Object.keys(summaryStatistics.value) as key}
                        <option value="{Number(key)}">
                            {#if Number(key) === 0}
                                Unassigned
                            {:else}
                                District {key}
                            {/if}
                        </option>
                    {/each}

                </select>

            </div>
        </div>
    </div>
{/if}

<hr class="my-2">

<slot/>
