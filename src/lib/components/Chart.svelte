<script>
    /*
        Reference:
        https://c3js.org/reference.html
    */

    import {onMount, onDestroy} from 'svelte'
    import {
        deviation,
        summaryStatistics,
        targetPerDistrict,
        warnings,
        stats,
        displayName,
        totalPopulation,
        districtColors,
    } from '$lib/masterStore.svelte.ts';

    import {
    } from '$lib/store.svelte.js'
    import groupBy from 'lodash-es/groupBy.js'
    import sum from 'lodash-es/sum.js';
    import {browser} from '$app/environment';

    let element
    let chart
    let c3
    // let d3

    const chartData = $derived([1, 2, 3, 4, 5].map(district => {
        return {
            name: district,
            Population: summaryStatistics.value[district].population,
            Target: targetPerDistrict.value,
        }
    }))

    const buildChart = () => {
        chart = c3.generate({
            bindto: element,
            legend: {
                show: false
            },
            data: {
                json: chartData,
                x: 'name',
                labels: {
                    format: (v, id) => id === 'Target' ? null : v
                },
                colors: {
                    Target: 'black',
                    Population: (data) => districtColors.value[data.x],
                },
                keys: {
                    x: 'name',
                    // y: 'name',
                    value: ['Population', 'Target']
                },
                types: {
                    Population: 'bar',
                    // Target: 'line',
                }
            },
            grid: {
                x: {
                    show: true
                },
                y: {
                    show: true
                },
            },
            axis: {
                rotated: true,
                x: {
                    // type: 'category',
                    // show: true,
                    tick: {
                        format: val => `Dist. ${val}`,
                    },
                    // max: 3000,
                    // label: {
                    //     text: 'Your X Axis',
                    //     position: 'inner-center',
                    // },
                },
                y: {
                    max: 2600,
                    // tick: {
                    //     centered: true,
                    //     outer: true,
                    // },
                    // label: {
                    //     text: 'Your Y Axis',
                    //     position: 'outer-middle',
                    // },
                }
            }
        })
    }

    $effect(() => {
        if (chart && chartData) {
            chart.load({
                json: chartData,
                x: 'name',
                labels: {
                    format: (v, id) => id === 'Target' ? null : v
                },
                keys: {
                    x: 'name',
                    // y: 'name',
                    value: ['Population', 'Target']
                },
                types: {
                    Population: 'bar',
                    // Target: 'line',
                }
            })
            chart.flush()
        }
    })

    onMount(async () => {
        c3 = await import('c3')
        buildChart()
    })

    onDestroy(() => {
        if (chart) {
            chart = chart.destroy()
        }
    })
</script>

<div class="h-100 flex-grow-1 d-flex flex-column">

    <!--    <pre>{JSON.stringify(summaryStatistics.value, null, 2)}</pre>-->

    <!--    <div class="d-flex justify-content-evenly text-center">-->
    {#if stats.working}
        <div class="d-flex align-items-center justify-content-center">
            <div class="spinner-grow" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="">
                &nbsp; Updating Chart...
            </div>
        </div>
    {:else }
        <div class="alert alert-success mb-0 w-100 py-1"
             class:alert-danger={warnings.value.unassignedBlocksPresent || warnings.value.excessiveDeviation}>
            <div class="row justify-content-around">
                <div class="col-auto">
                    {displayName.value}
                </div>
                <div class="col-auto">
                    Total Population: {totalPopulation.value}
                </div>
                <div class="col-auto">
                    Target Population Per District: {Math.round(totalPopulation.value / 5)}
                </div>
                <div class="col-auto">
                    Total Deviation: {deviation.value.totalDeviation.toFixed(1)}%
                </div>

            </div>
        </div>
    {/if}

    <!--        <div class="alert alert-warning mb-0 w-50 py-1">-->
    <!--            Diff between high and low: {$districtGap.toFixed(1)}%. (Max is 10%.)-->
    <!--        </div>-->
    <!--    </div>-->

    <div class="flex-grow-1" id="chart" bind:this={element}></div>
    <!--    <canvas id="chart" bind:this={element}></canvas>-->

</div>

<style global>
    #chart {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: ghostwhite;
    }

    .c3-line-Target {
        stroke-width: 3px !important;
        stroke: grey !important;
    }

    .c3-axis-x > .domain {
        stroke: black !important;
        stroke-width: 2px;
    }

    .c3-axis-y > .domain {
        stroke: black !important;
        stroke-width: 2px;
    }


    .c3-target-Population > .c3-bar-1 {
        background-color: red !important;
    }

    /*.c3-axis-x {*/

    /*}*/

    /*.c3-axis-y {*/

    /*}*/

    .c3-axis-x-label {
        color: red !important;
    }

    .c3-axis-y-label {
        color: red !important;
    }
</style>
