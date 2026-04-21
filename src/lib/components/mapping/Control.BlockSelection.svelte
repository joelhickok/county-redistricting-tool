<script>
    import {getContext, onMount, onDestroy, beforeUpdate} from 'svelte'
    import {
        populationIndicator,
    } from '$lib/store.svelte'
    import getStyle from '$lib/get-style.js'
    import db from '$lib/client-database.js'
    import Icon from 'svelte-awesome'
    // import {faHandPointUp as point} from '@fortawesome/free-regular-svg-icons/mouse'
    import {faMousePointer as point} from '@fortawesome/free-solid-svg-icons/faMousePointer'
    import {faSquare as rectangle} from '@fortawesome/free-solid-svg-icons/faSquare'
    import {faPencilAlt as drawIcon} from '@fortawesome/free-solid-svg-icons/faPencilAlt'
    import {
        mapState,
        blockGeoJSON,
        currentDistrict,
        selection,
        isDrawing,
        districtColors,
        blocksLayer,
    } from '$lib/masterStore.svelte.ts';

    export let position = 'topleft'

    export let options = {
        intersect: true,
        polygon: {
            color: 'yellow',
        }
    }

    let customControl = 'BlockSelection'
    let element
    let control
    let L
    let lasso
    // let draw
    let localMap
    const {getMap} = getContext(L)
    let overRide = false

    const removeControl = () => {
        // if (control) {
        //     control.remove()
        // }
    }

    const activatePoint = () => {
        lasso.disable()
        localMap.pm.disableDraw('Rectangle')
    }

    const activateDraw = () => {
        lasso.enable()
        isDrawing.value = true
        localMap.pm.disableDraw('Rectangle')
    }

    const activateRectangle = () => {
        lasso.disable()
        isDrawing.value = true
        localMap.pm.enableDraw('Rectangle', {
            snappable: false,
        })
    }

    const handleSwitch = () => {
        console.log(`Selected Tool: ${selection.value}`)
        // draw.disable()
        isDrawing.value = false
        overRide = false
        if (selection.value === 'draw') {
            activateDraw()
        } else if (selection.value === 'rectangle') {
            activateRectangle()
        } else {
            isDrawing.value = false
            activatePoint()
        }
    }

    $: if (selection.value && localMap) {
        handleSwitch()
    }

    const addControl = async () => {
        const module = await import('leaflet')
        L = module.default
        await import('leaflet-lasso')
        // await import('leaflet-draw')

        localMap = getMap()

        lasso = L.lasso(localMap, options)

        localMap.on('keydown', async (e) => {
            const key = e.originalEvent.key.toLowerCase()
            if (['p', 'r', 'd'].includes(key)) {
                if (key === 'p') {
                    // overRide = true
                    selection.value = 'point'
                }
                if (key === 'r') {
                    // overRide = true
                    selection.value = 'rectangle'
                }
                if (key === 'd') {
                    // overRide = true
                    selection.value = 'draw'
                }
                handleSwitch()
            }
        })

        localMap.on('pm:create', async e => {
            console.log('pm:create')
            mapState.working = true
            const bounds = e.layer.getBounds()
            // $selectRectangle = e.layer.getBounds()

            console.log(bounds.toString())

            blocksLayer.value.eachLayer(async layer => {
                // determine if the "select bounds" intersect a block
                if (bounds.intersects(layer.getBounds())) {
                    layer.feature.properties.District = currentDistrict.value
                    layer.setStyle(getStyle(districtColors.value, layer.feature.properties))
                }
            })
            localMap.removeLayer(e.layer)
            blockGeoJSON.value = [
                ...blocksLayer.value.toGeoJSON().features,
            ]
            await db.bulkPut(blockGeoJSON.value)
            // handleSwitch()
            selection.value = 'point'
            mapState.working = false
        })

        // localMap.on(L.Draw.Event.DRAWSTART, function () {
        //     console.log('L.Draw.Event.DRAWSTART')
        //     // isDrawing.value = true
        // })
        //
        // localMap.on(L.Draw.Event.DRAWSTOP, function (e) {
        //     console.log('L.Draw.Event.DRAWSTOP')
        //     // isDrawing.value = false
        // })

        // localMap.on(L.Draw.Event.CREATED, async (e) => {
        //     console.log('Created polygon')
        //     mapWorking = true
        //     const bounds = e.layer.getBounds()
        //     // $selectRectangle = e.layer.getBounds()
        //
        //     blocksLayer.value.eachLayer(async layer => {
        //         // determine if the "select bounds" intersect a block
        //         if (bounds.intersects(layer.getBounds())) {
        //             layer.feature.properties.District = currentDistrict.value
        //             layer.setStyle(getStyle($districtColors, layer.feature.properties))
        //         }
        //     })
        //     $blockGeoJSON = [
        //         ...blocksLayer.value.toGeoJSON().features,
        //     ]
        //     mapWorking = false
        //     await db.bulkPut($$blockGeoJSON)
        //     // draw.enable()
        // })

        localMap.on('lasso.finished', async (event) => {
            console.log('lasso.finished')
            console.log(event)

            const filtered = event.layers.filter(layer => {
                return !layer?.options?.url
            })

            mapState.working = true
            filtered.forEach(layer => {
                layer.feature.properties.District = currentDistrict.value
                layer.setStyle(getStyle(districtColors.value, layer.feature.properties))
            })

            blockGeoJSON.value = [
                ...blocksLayer.value.toGeoJSON().features,
            ]

            await db.bulkPut(blockGeoJSON.value)
            mapState.working = false
            // lasso.enable()
            selection.value = 'point'
        })

        L.Control[customControl] = L.Control.extend({
            onAdd: function () {
                return element
            },
            onRemove: function () {
                // Nothing to do here
            }
        })

        L.control[customControl.toLowerCase()] = function (opts) {
            return new L.Control[customControl](opts)
        }

        control = L.control[customControl.toLowerCase()]({position})
            .addTo(localMap)
    }

    onMount(async () => {
        const module = await import('leaflet')
        L = module.default
        L.DomEvent.disableClickPropagation(element)
        L.DomEvent.disableScrollPropagation(element)
        addControl()
    })

    onDestroy(() => {
        removeControl()
    })
</script>

<div class="leaflet-control">

    <div bind:this={element} class="card leaflet-bar custom-controls">

        <div class="card-body">
            <h6 class="text-info">Block Selection</h6>

            <button class="d-flex align-items-center block-selection"
                    on:click|stopPropagation={() => selection.value = 'point'}>
                <span class="text-center icon-col">
                    <Icon data={point}/>
                </span>
                <span class="flex-grow-1">
                    <span class="form-check mb-0 py-1" style="min-height: auto;">
                        <input on:change|preventDefault={() => handleSwitch()}
                               bind:group={selection.value}
                               value="point"
                               class="form-check-input"
                               type="radio"
                               name="flexRadioDefault"
                               id="selectionControl">
                        <label class="form-check-label pb-0 mb-0" for="selectionControl">
                            Point &amp; Click
                        </label>
                    </span>
                </span>
                <span class="text-muted small shortcut">
                    Press P
                </span>
            </button>


            <button class="d-flex align-items-center block-selection" on:click|stopPropagation={() => selection.value = 'rectangle'}
                    class:bg-extra-light={selection.value === 'rectangle'}>
                <span class="text-center icon-col">
                    <Icon data={rectangle}/>
                </span>
                <span class="flex-grow-1">
                    <span class="form-check mb-0 py-1" style="min-height: auto;">
                        <input on:click|stopPropagation={() => handleSwitch()}
                               bind:group={selection.value}
                               value="rectangle"
                               class="form-check-input" type="radio" name="flexRadioDefault"
                               id="rectangleControl">
                        <label class="form-check-label" for="rectangleControl">
                            Rectangle
                        </label>
                    </span>
                </span>
                <span class="text-muted small shortcut">
                    Press R
                </span>
            </button>

            <button class="d-flex align-items-center block-selection" on:click|stopPropagation={() => selection.value = 'draw'}
                    class:bg-extra-light={selection.value === 'draw'}>
                <span class="text-center icon-col">
                    <Icon data={drawIcon}/>
                </span>
                <span class="flex-grow-1">
                    <span class="form-check mb-0 py-1" style="min-height: auto;">
                        <input on:click|stopPropagation={() => handleSwitch()}
                               bind:group={selection.value}
                               value="draw"
                               class="form-check-input" type="radio" name="flexRadioDefault"
                               id="lassoControl">
                        <label class="form-check-label" for="lassoControl">
                            Draw
                        </label>
                    </span>
                </span>
                <span class="text-muted small shortcut">
                    Press D
                </span>
            </button>

            {#if $populationIndicator !== undefined && $populationIndicator !== null}
                <h6 class="mt-3">
                    Pop. Block Under Cursor:<br>
                    {$populationIndicator}
                </h6>
            {/if}

        </div>

    </div>

</div>

<style>
    .icon-col {
        width: 28px;
    }
</style>
