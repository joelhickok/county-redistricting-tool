<script>
    import {getContext, onMount, onDestroy} from 'svelte'
    import intersect from '@turf/intersect'
    import centerOfMass from '@turf/center-of-mass'
    import pointOnFeature from '@turf/point-on-feature'
    import center from '@turf/center'
    import {booleanPointInPolygon} from '@turf/turf'
    import centroid from '@turf/centroid'
    import {log} from 'mathjs'
    import {overlays} from '$lib/masterStore.svelte.js'

    // import getStyle from '$lib/get-style'
    // import {districtColors,} from '$lib/store.svelte'

    export let map = null
    export let name = null
    export let labelLayer = null
    export let minLabelZoom = 12
    export let labelField = 'P0010001'
    export let labelPrePend = ''
    // export let name = 'Unnamed'

    let L

    const removeLayer = () => {
        if (labelLayer && map) {
            if (map.hasLayer(labelLayer)) {
                map.removeLayer(labelLayer)
            }
        }
    }

    $: {
        if (overlays.value[name] && !overlays.value[name].visible && labelLayer) {
            labelLayer.clearLayers()
        }
    }

    const createMarker = (centerPoint, feature) => {
        const latlng = centerPoint.geometry.coordinates.reverse()
        // L.circleMarker(latlng, {radius: 10}).addTo(map)
        const marker = L.marker(latlng, {
            icon: L.divIcon({
                html: `${labelPrePend} ${feature.properties[labelField]}`,
                className: 'text-labels',
                // iconAnchor: [50, 10]
            }),
            zIndexOffset: 1000,
        })
        labelLayer.addLayer(marker)
    }

    export const addLabel = (boundsGeoJSON, layer) => {
        if (!boundsGeoJSON) return
        const zoom = map.getZoom()

        if (zoom >= minLabelZoom && layer?.feature && layer.feature.properties[labelField]) {
            const intersected = intersect(boundsGeoJSON, layer.feature)
            if (!intersected) {
                // setTimeout(() => {
                //     const coordinates = layer.feature.geometry.coordinates.map(ring => ring.map(coord => coord.reverse()))
                //     L.polygon(coordinates, {color: 'red'})
                //         .bringToFront()
                //         .addTo(map)
                // }, 300)
                return
            }

            try {
                let centerPoint

                let labelOptions = {
                    centerOfMass: centerOfMass(intersected),
                    centroid: centroid(intersected),
                }

                if (booleanPointInPolygon(labelOptions.centerOfMass, layer.feature)) {
                    centerPoint = labelOptions.centerOfMass
                } else if (booleanPointInPolygon(labelOptions.centroid, layer.feature)) {
                    centerPoint = labelOptions.centroid
                } else {
                    centerPoint = pointOnFeature(intersected)
                }

                if (centerPoint) {
                    createMarker(centerPoint, layer.feature)
                }
            } catch (err) {
                // console.log(`Failed to create label for feature`)
                // console.log(layer.feature.properties.P0010001)
            }
        }
    }


    onMount(async () => {
        const module = await import('leaflet')
        L = module.default
        labelLayer = L.layerGroup().addTo(map)
    })

    onDestroy(() => {
        removeLayer()
    })

    export function getLayer() {
        return labelLayer
    }
</script>
