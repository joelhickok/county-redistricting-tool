<script>
    import {onMount, getContext} from 'svelte'
    import { overlays, classBreakInfos} from '$lib/masterStore.svelte'

    export let position = 'topright'
    let localMap
    let customControl = 'legend'
    let control
    let L
    let element
    let legendVisible = false

    $: {
        const names = Object.keys(classBreakInfos.value)
        legendVisible = names.some(name => overlays.value[name].visible)
    }

    const {getMap} = getContext(L)

    // const cleanupName = (val) => {
    //     return val.replace('blockDemoApp/> ', '').split('/')[0]
    // }

    onMount(async () => {
        const module = await import('leaflet')
        L = module.default
        localMap = getMap()

        L.DomEvent.disableClickPropagation(element)
        L.DomEvent.disableScrollPropagation(element)

        L.Control[customControl] = L.Control.extend({
            onAdd: function () {
                return element
            },
            onRemove: function () {
                // Nothing to do here
            },
        })

        L.control[customControl.toLowerCase()] = function (opts) {
            return new L.Control[customControl](opts)
        }

        control = L.control[customControl.toLowerCase()]({position}).addTo(localMap)
    })

</script>

<div bind:this={element}>

    {#if legendVisible}
        <div class="leaflet-bar bg-white h-100 p-3 custom-controls">
            <h6>Legend</h6>

            {#each Object.keys(classBreakInfos.value) as classBreakInfo, index}

                {#if overlays.value[classBreakInfo] && overlays.value[classBreakInfo].visible}

                    <div class="mt-2 border-top">{classBreakInfo}</div>

                    {#each classBreakInfos.value[classBreakInfo] as classBreakInfoEntry}
                        <div class="row g-0">
                            <div class="col" style="font-size: 11px;">
                                {classBreakInfoEntry.label}
                            </div>
                            <div class="col-auto"
                                 style="min-width:50px; background-color: rgba({classBreakInfoEntry.symbol.color.join(', ')}); height: 10px;">
                                &nbsp
                            </div>
                        </div>

                    {/each}
                    <!--{:else }-->
                    <!--            <div>f</div>-->
                {/if}

            {/each}
        </div>

    {/if}

</div>
