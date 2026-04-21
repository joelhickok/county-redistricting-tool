<script>
    import {getContext, onMount, onDestroy, beforeUpdate} from 'svelte'
    import {page,} from '$app/stores'

    import {highlight, mapRef} from '$lib/store.svelte'

    let layer
    let L
    let localMap
    const {getMap} = getContext(L)

    onMount(async () => {
        const {geoJSON} = await import('leaflet')
         localMap = getMap()

        layer = geoJSON(null, {
            style() {
                return {
                    color: 'aqua',
                }
            },
            // onEachFeature(feature, layer) {
            // layer.bindTooltip(`${feature.properties.P0010001.toString()}`, {
            //     sticky: true,
            // })
            // },
        })
            .addTo(localMap)
            .bringToFront()
    })

    $: if ($highlight && layer && localMap) {
        layer.clearLayers()
        layer.addData($highlight)

        localMap.fitBounds(layer.getBounds(), {
            padding: [100, 100],
            maxZoom: 18,
        })
        layer.openPopup()
    } else if (!$highlight) {
        if (layer) {
            layer.clearLayers()
        }
    }


    $: if (!$page.url.pathname.includes('build/detail') && layer) {
        layer.clearLayers()
    }
</script>

<slot/>
