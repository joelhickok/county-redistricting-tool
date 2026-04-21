<script>
    import {getContext, onMount, onDestroy} from 'svelte'
    import {
        populationIndicator,
    } from '$lib/store.svelte'
    import getStyle from '$lib/get-style.js'
    import db from '$lib/client-database.js'
    import {page} from '$app/stores'
    import {
        mapState,
        blocksLayer,
        blockGeoJSON,
        overlays,
        isDrawing,
        currentDistrict,
        districtColors
    } from '$lib/masterStore.svelte.ts';

    let {
        immediate,
        name,
    } = $props();

    let L
    let localMap
    let layer
    let tipsEnabled = false
    const {getMap} = getContext(L)

    // $: if ($page.url.pathname.includes('/existing') && layer && getMap().hasLayer(layer)) {
    //     getMap().removeLayer(layer)
    //     // overlays.value['Working Proposal'].visible = false
    // } else {
    //     if (layer && !getMap().hasLayer(layer)) {
    //         getMap().addLayer(layer)
    //     }
    // }

    const handleTooltips = () => {
        console.log(`Current Map Zoon: ${localMap.getZoom()}`)
        const zoomLevel = 12

        if (localMap.getZoom() >= zoomLevel && !tipsEnabled) {
            layer.bindTooltip((layer) => {
                return `Pop. ${layer.feature.properties.P0010001}`
            }, {
                sticky: true,
            })
            tipsEnabled = true
        } else if (localMap.getZoom() < zoomLevel) {
            tipsEnabled = false
            layer.unbindTooltip()
        }
    }

    onMount(async () => {
        L = await import('leaflet')
        // console.log(`Looks like there are ${$blockGeoJSON?.length} features already loaded`)
        localMap = getMap()

        layer = L.geoJSON(blockGeoJSON.value, {
            style(feature) {
                return getStyle(districtColors.value, feature.properties)
            },
        })
        // if (localMap.getZoom() >= 15) {
        //     layer.bindTooltip((layer) => {
        //         return layer.feature.properties.P0010001
        //     })
        // }

        layer
            .bringToBack()
            .on('click', async e => {
                // console.log('click')
                if (isDrawing.value) return
                mapState.working = true
                // L.DomUtil.removeClass(localMap._container, 'working')
                const properties = e.layer.feature.properties

                if (currentDistrict.value === Number(properties.District)) {
                    properties.District = 0
                } else {
                    properties.District = currentDistrict.value
                }

                e.layer.setStyle(getStyle(districtColors.value, properties))

                const index = blockGeoJSON.value.findIndex(val => {
                    return val.properties.GEOID20 === properties.GEOID20
                })

                blockGeoJSON.value[index] = e.layer.feature
                console.log(blockGeoJSON.value[index])

                const result = await db.put(e.layer.feature)
                mapState.working = false
            })

        if (immediate) {
            layer.addTo(localMap)
        }

        handleTooltips()

        localMap.on('zoomend', (e) => {
            handleTooltips()
            // e.layer.bindTooltip(`Pop: ${e.layer.feature.properties.P0010001}`, options).openTooltip()
        })

        blocksLayer.value = layer

        overlays.value[name] = {
            name,
            layer,
            visible: immediate,
            group: 'Main',
        }
    })

    $effect(() => {
        if (blockGeoJSON && layer) {
            layer.clearLayers()
            layer.addData(blockGeoJSON)
        }
    })

    onDestroy(() => {
        if (layer && localMap) {
            localMap.removeLayer(layer)
        }
    })
</script>

<div></div>
