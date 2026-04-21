<script>
    import uniqBy from 'lodash-es/uniqBy.js'
    import {setContext} from 'svelte'
    import Icon from 'svelte-awesome'
    import groupBy from 'lodash-es/groupBy.js'
    import {faLayerGroup as layer} from '@fortawesome/free-solid-svg-icons/faLayerGroup'
    import {scale, fly} from 'svelte/transition'
    import {quintOut} from 'svelte/easing'
    import {getContext, onMount, onDestroy, beforeUpdate} from 'svelte'
    import {overlayLayers} from '$lib/store.svelte'
    import {overlays} from '$lib/masterStore.svelte.ts';
    
    import {animate} from 'animejs'
    import camelCase from 'voca/camel_case.js'

    export let position = 'topright'

    let open = false
    let control
    let element
    let controlId = new Date().toString()
    let customControl = 'LayerControl'
    let L
    let localMap
    const {getMap} = getContext(L)
    let layerActive = {}

    const toCamelCase = (group) => camelCase(group)

    $: {
        Object.keys(overlays.value).forEach(name => {
            layerActive[name] = overlays.value[name].visible
        })
    }

    $: groups = groupBy(Object.values(overlays.value), 'group')

    $: if (element && open) {
        animate(element, {
            // targets: element,
            width: '250px',
            height: '280px',
            duration: 200,
            easing: 'easeInExpo',
        })
        // setTimeout(() => {
        //     document.querySelector(`#flush-collapse-main`).classList.add('show')
        // }, 200)
    } else if (element) {
        animate(element, {
            // targets: element,
            width: '35px',
            height: '35px',
            duration: 200,
            easing: 'easeOutSine',
        })
    }

    const removeControl = () => {
        if (control && localMap) {
            // localMap.removeControl(control)
        }
    }

    const addControl = async () => {
        const module = await import('leaflet')
        L = module.default
        localMap = getMap()

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
    }

    const toggleLayer = (name, overlayLayer) => {
        // console.log(name)
        // console.log(overlayLayer)
        overlays.value[name].visible = !overlays.value[name].visible

        const layer = overlayLayer.layer
        if (getMap().hasLayer(layer)) {
            getMap().removeLayer(layer)
        } else {
            getMap().addLayer(layer)
        }
    }

    onMount(async () => {
        const module = await import('leaflet')
        L = module.default
        L.DomEvent.disableClickPropagation(element)
        L.DomEvent.disableScrollPropagation(element)
        setTimeout(() => {
            addControl()
        }, 1000)

        // setTimeout(() => {
        //     document.querySelector(`#flush-collapse-main`).classList.add('show')
        // }, 500)
    })

    onDestroy(() => {
        console.warn('custom control onDestroy')
        removeControl()
    })

    export function getControl() {
        return control
    }
</script>

<div id="{controlId}"
     bind:this={element}
     class="card leaflet-control leaflet-bar"
     on:mouseenter={() => open = true}
     on:mouseleave={() => open = false}
     role="alert"
>
    {#if open}
        <div class=""
             style="font-size: 8pt !important; overflow-x: hidden">

            <h6 class="px-3 pt-2">Toggle Map Layers</h6>

            <hr class="my-1">

            {#if groups['Main']}
                <div class="mx-4">
                    {#each groups['Main'] as overlayGroup, index (index)}
                        <div class="form-check form-switch">
                            <input class="form-check-input"
                                   type="checkbox"
                                   id="switch-main"
                                   checked={layerActive[overlayGroup.name]}
                                   on:change|stopPropagation|preventDefault={() => toggleLayer(overlayGroup.name, overlayGroup)}>
                            <label class="form-check-label"
                                   for="switch-{overlayGroup.name}">
                                {overlayGroup.name}
                            </label>
                        </div>
                    {/each}
                </div>
            {/if}

            <div class="accordion accordion-flush" id="layerMenu">

                {#each Object.keys(groups) as group, index (index)}
                    {#if group !== 'Main'}
                        <div class="accordion-item">
                            <h6 class="accordion-header" id="heading-{toCamelCase(group)}">
                                <button class="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#flush-collapse-{toCamelCase(group)}"
                                        aria-expanded="false"
                                        aria-controls="flush-collapse-{toCamelCase(group)}"
                                >
                                    {group}
                                </button>
                            </h6>
                            <div id="flush-collapse-{toCamelCase(group)}"
                                 class="accordion-collapse collapse"
                                 aria-labelledby="heading-{toCamelCase(group)}"
                                 data-bs-parent="#layerMenu"
                            >
                                <div class="accordion-body py-0">

                                    {#each groups[group] as overlayGroup, index (index)}

                                        <div class="form-check form-switch">
                                            <input class="form-check-input"
                                                   type="checkbox"
                                                   id="switch-{overlayGroup.name}"
                                                   checked={layerActive[overlayGroup.name]}
                                                   on:change|stopPropagation|preventDefault={() => toggleLayer(overlayGroup.name, overlayGroup)}>
                                            <label class="form-check-label"
                                                   for="switch-{overlayGroup.name}">
                                                {overlayGroup.name}
                                            </label>
                                        </div>
                                    {/each}

                                </div>
                            </div>
                        </div>
                    {/if}
                {/each}

            </div>

        </div>
    {:else}
        <div class="bg-white">
            <button class="btn m-0 p-0" style="width: 30px; height: 30px;">
                <Icon data={layer} scale="1"/>
            </button>
        </div>
    {/if}
</div>
