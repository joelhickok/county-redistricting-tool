<script>
    import StatValue from './StatValue.svelte'
    import Icon from 'svelte-awesome'
    import {faTimes as current} from '@fortawesome/free-solid-svg-icons/faTimes.js'
    import {faCaretRight as showDetailsClosed} from '@fortawesome/free-solid-svg-icons/faCaretRight.js'
    import {faCaretDown as showDetailsOpen} from '@fortawesome/free-solid-svg-icons/faCaretDown.js'
    import {createEventDispatcher} from 'svelte'
    import {slide} from 'svelte/transition'

    const dispatch = createEventDispatcher()

    export let district = 0
    export let properties = null

    let details = false

    // if (Number(district) === 1) {
    //     details = true
    // }

    // const fontColorsPrimary  = {
    //     1: 'text-white',
    //     2: 'text-white',
    //     3: 'text-black',
    //     4: 'text-white',
    //     5: 'text-white',
    // }

    // const fontColorsSecondary  = {
    //     1: 'text-white',
    //     2: 'text-white',
    //     3: 'text-black',
    //     4: 'text-white',
    //     5: 'text-white',
    // }
</script>

{#if properties}

    <div class="primary-{district} clickable">
        <div class="d-flex align-items-center">

            <div class="mx-2" on:click={() => details = !details}>
                {#if details}
                    <Icon class="" data={showDetailsOpen} scale="1.8"/>
                {:else}
                    <Icon class="" data={showDetailsClosed} scale="1.8"/>
                {/if}
            </div>

            <div class="flex-grow-1" on:click={() => details = !details}>
                <h4 class="my-0 py-0">&nbsp; District {district}</h4>
            </div>

            <div class="flex-grow-1 px-2 text-center" on:click={() => details = !details}>
                <div class="h5 my-0 py-0">
                    Population
                </div>
                <div class="h5 my-0 py-0">
                    {properties.population || 0}
                </div>
            </div>

            <div class="flex-grow-1 px-2 text-center" on:click={() => details = !details}>
                <div>
                    Deviation
                </div>
                <div style="font-size: 16pt;">
                    {Math.round(properties.deviation) || 0}
                </div>
            </div>

            <div class="primary-{district} text-center">
                <button class="btn text-center h-100"
                        on:click|stopPropagation={() => dispatch('clear-district', district)}
                >
                    <Icon class="" data={current} scale="1.0"/>
                    <!--                    Clear-->
                </button>
            </div>

        </div>

        {#if details}

            <hr class="mt-0">

            <div transition:slide
                 on:click={() => details = false}
                 on:click={() => details = false}
                 class="d-flex justify-content-evenly pb-1"
                 style="font-size: 13px !important;"
            >

                <div class="secondary-{district} text-secondary-{district} stat-demo">
                    Incorporated<br>
                    <span class="widget">{properties.IncorporatedTotalPerc} %</span>
                </div>

                <div class="secondary-{district} text-secondary-{district} stat-demo">
                    Voting Age 18+<br>
                    <span class="widget">{properties.votingAgePerc} %</span>
                </div>

                <div class="secondary-{district} text-secondary-{district} stat-demo">
                    Hispanic<br>
                    <span class="widget">{properties.hispanicPerc} %</span>
                </div>

                <div class="secondary-{district} text-secondary-{district} stat-demo">
                    White<br>
                    <span class="widget">{properties.whiteOnlyPerc} %</span>
                </div>

                <div class="secondary-{district} text-secondary-{district} stat-demo">
                    Black<br>
                    <span class="widget">{properties.blackPerc} %</span>
                </div>

                <div class="secondary-{district} text-secondary-{district} stat-demo">
                    Nat. Amer.<br>
                    <span class="widget">{properties.indianPerc} %</span>
                </div>

                <div class="secondary-{district} text-secondary-{district} stat-demo">
                    Asian<br>
                    <span class="widget">{properties.asianPerc} %</span>
                </div>

                <div class="secondary-{district} text-secondary-{district} stat-demo">
                    Islander<br>
                    <span class="widget">{properties.islanderPerc} %</span>
                </div>

                <div class="secondary-{district} text-secondary-{district} stat-demo">
                    Other<br>
                    <span class="widget">{properties.otherPerc} %</span>
                </div>

            </div>

            <!--                        <pre>{JSON.stringify(properties, null, 2)}</pre>-->
        {/if}
    </div>

{/if}

<style global lang="scss">
  .stat-demo {
    text-align: center;
    padding: 2px 4px;
  }

  .clickable {
    cursor: pointer;
  }
</style>
