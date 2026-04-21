<script>
    import {getContext, onMount, onDestroy, beforeUpdate} from 'svelte'
    import {polygon} from '@turf/turf'
    import Color from 'color'
    import {overlays, classBreakInfos,overlayLayers} from '$lib/masterStore.svelte.ts';

    import Labels from '$lib/components/mapping/Layer.Labels.svelte'

    export let legend = false
    export let immediate = false
    export let url
    export let group = 'Main'
    export let nativeRendering = false
    export let labels = false
    export let minLabelZoom = null
    export let labelComponent = null
    export let labelField = 'P0010001'
    export let labelPrePend = ''
    export let name = 'Unnamed'
    export let color = 'white'

    let defaultStyle = {}

    if (color) {
        defaultStyle.color = color
    }

    let map
    let layer
    let labelLayer
    let featureLayer
    let currentBoundsGeoJSON
    let L
    const {getMap} = getContext(L)

    let overlayInfo = {
        layer,
        name,
        visible: immediate,
    }

    const remove = () => {
        if (layer) {
            layer.remove()
        }
        if (labelLayer) {
            labelLayer.remove()
        }
    }

    const getCurrentMapBounds = () => {
        if (map) {
            const bounds = map.getBounds()
            const sw = bounds.getSouthWest()
            const nw = bounds.getNorthWest()
            const ne = bounds.getNorthEast()
            const se = bounds.getSouthEast()

            if (!bounds) return

            currentBoundsGeoJSON = polygon([[
                [sw.lng, sw.lat],
                [nw.lng, nw.lat],
                [ne.lng, ne.lat],
                [se.lng, se.lat],
                [sw.lng, sw.lat]
            ]])
        }
    }

    const add = async () => {
        map = getMap()
        remove()
        if (immediate) {
            map.addLayer(layer)
            getCurrentMapBounds()
        }
    }

    const placeLabel = () => {
        if (labels && labelLayer) {
            labelLayer.clearLayers()
            layer.eachActiveFeature(layer => {
                labelComponent.addLabel(currentBoundsGeoJSON, layer)
            })
        }
    }

    $: {
        if (overlays.value[name] && overlays.value[name].visible) {
            getCurrentMapBounds()
        }
    }

    $: {
        if (currentBoundsGeoJSON) {
            if (labels && labelLayer) {
                placeLabel()
            } else {
                setTimeout(() => {
                    placeLabel()
                }, 500)
            }
        }
    }

    onMount(async () => {
        const module = await import('leaflet')
        L = module.default
        let esriLeaflet = await import('esri-leaflet')
        featureLayer = esriLeaflet.featureLayer

        // console.log(`${name} - (immediate: ${immediate}) - (legend: ${legend})`)
        // console.log(url)

        layer = featureLayer({
            url,
            interactive: false,
        })

        overlays.value[name] = {
            name,
            layer,
            visible: immediate,
            group,
        }

        layer.metadata(async (error, metadata) => {

            if (legend && metadata) {
                classBreakInfos.value[name] = metadata.drawingInfo.renderer.classBreakInfos
                // console.log('got class break infos for', name)
            }

            if (nativeRendering && metadata) {
                // console.log('Using nativeRendering')
                const infos = metadata.drawingInfo.renderer.classBreakInfos

                layer.setStyle(feature => {
                    const style = {
                        ...defaultStyle,
                        fillColor: 'transparent',
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 1,
                    }

                    if (metadata.drawingInfo.renderer.type === 'simple') {
                        const fill = Color.rgb(metadata.drawingInfo.renderer.symbol.color)
                        const outline = Color.rgb(metadata.drawingInfo.renderer.symbol.outline.color)
                        style.opacity = outline.hsl().valpha
                        style.color = outline.hex()
                        style.weight = metadata.drawingInfo.renderer.symbol.outline.width
                        style.fillColor = fill.hex()
                        style.fillOpacity = fill.hsl().valpha
                    } else {
                        const popValue = Number(feature.properties.P0010001)
                        if (popValue === 0) {
                            style.color = 'transparent'
                        } else if (popValue > 0 && popValue <= infos[0].classMaxValue) {
                            style.fillColor = Color.rgb(infos[0].symbol.color).hex()
                        } else if (popValue > infos[0].classMaxValue && popValue <= infos[1].classMaxValue) {
                            style.fillColor = Color.rgb(infos[1].symbol.color).hex()
                        } else if (popValue > infos[1].classMaxValue && popValue <= infos[2].classMaxValue) {
                            style.fillColor = Color.rgb(infos[2].symbol.color).hex()
                        } else if (popValue > infos[2].classMaxValue && popValue <= infos[3].classMaxValue) {
                            style.fillColor = Color.rgb(infos[3].symbol.color).hex()
                        } else if (popValue > infos[3].classMaxValue && popValue <= infos[4].classMaxValue) {
                            style.fillColor = Color.rgb(infos[4].symbol.color).hex()
                        } else if (popValue > infos[4].classMaxValue && popValue <= infos[5].classMaxValue) {
                            style.fillColor = Color.rgb(infos[5].symbol.color).hex()
                        }
                    }

                    return style
                })
            } else if (color) {
                layer.setStyle(() => {
                    return {
                        color,
                    }
                })
            }

            await add()

            map.on('zoomend moveend', () => {
                getCurrentMapBounds()
            })
        })

    })

    onDestroy(() => {
        const index = overlayLayers.value.findIndex(overlay => {
            return overlay.layer === overlayInfo.layer
        })
        overlayLayers.value.splice(index, 1)
    })

    export function getLayer() {
        return layer
    }
</script>

{#if labels && map}
    <Labels bind:this={labelComponent}
            bind:labelLayer={labelLayer}
            {map}
            {name}
            {minLabelZoom}
            {labelField}
            {labelPrePend}/>
{/if}
