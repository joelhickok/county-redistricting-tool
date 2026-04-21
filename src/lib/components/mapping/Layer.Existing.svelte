<script>
    import {getContext, onDestroy} from 'svelte'
    import {
        currentExistingProposal,
    } from '$lib/store.svelte'
    import getStyle from '$lib/get-style.js'
    import {page,} from '$app/stores'
    import {blockGeoJSON, stats, overlays, districtColors} from '$lib/masterStore.svelte.ts';

    export let name = 'Unnamed'

    let previousUrl
    let layer
    let L
    const {getMap} = getContext(L)

    const removeLayer = () => {
        if (layer && getMap()) {
            if (getMap().hasLayer(layer)) {
                getMap().removeLayer(layer)
            }
        }
        overlays.value[name].visible = null
    }


    // $: if (!$page.url.pathname.startsWith('/existing')) {
    //     removeLayer()
    // }

    const add = async () => {
        console.warn('Adding existing prpopsal')
        // const module = await import('leaflet')
        // L = module.default
        const {featureLayer} = await import('esri-leaflet')
        let map = getMap()

        // Object.keys(overlays.value).forEach(key => {
        //     map.removeLayer(overlays.value[key].layer)
        // })
        if (layer && map.hasLayer(layer)) {
            map.removeLayer(layer)
        }

        layer = featureLayer({
            url: $currentExistingProposal,
            interactive: false,
            style(feature) {
                return getStyle($districtColors, feature.properties)
            },
        })

        stats.updating = true
        layer.query()
            .run(function(error, featureCollection){
                // console.log(featureCollection);
                blockGeoJSON.value = [
                    ...featureCollection.features,
                ]
                stats.updating = false
            });

        map.addLayer(layer)

        overlays.value[name] = {
            layer,
            visible: true,
        }
    }

    $: if ($currentExistingProposal) {
        if (previousUrl !== $currentExistingProposal) {
            add()
        }
    }

    // onMount(() => {
    //     console.log('existing layer onMount')
    // })

    onDestroy(() => {
        // console.log('existing layer onDestroy')
        removeLayer()
    })

    // beforeUpdate(() => {
    //     console.log('existing layer beforeUpdate')
    // })

    export function getLayer() {
        return layer
    }
</script>
