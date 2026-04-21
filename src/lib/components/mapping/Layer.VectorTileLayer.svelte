<script>
    import {getContext, setContext, onMount, onDestroy, beforeUpdate} from 'svelte'
    import {overlays} from '$lib/masterStore.svelte.ts'

    export let immediate = false
    export let layerId
    let layer
    let L
    const {getMap} = getContext(L)
    export let name = 'Unnamed'
    let metadata

    setContext(name, {
        getLayer: () => layer,
    })

    const remove = () => {
        if (layer) {
            layer.remove()
        }
        // console.log('layerControl', name)
        // console.log(layerControl)
        // console.log(typeof layerControl.getControl)
        // if (layerControl && layerControl.getControl && layerControl.hasOwnProperty('getControl') && layer) {
        //     layerControl.getControl().removeLayer(layer)
        // }
    }

    const add = async () => {
        const module = await import('leaflet')
        L = module.default
        const {vectorTileLayer} = await import('esri-leaflet-vector')

        layer = vectorTileLayer(layerId, {
            style(style) {
                console.log(style)
                metadata = style
                return style
            }
        })

        console.log(layer)
        console.log(layer.metadata)

        if (immediate) {
            const m = getMap()
            if (m.hasLayer(layer)) {
                m.removeLayer(layer)
            }
            // m.addLayer(layer)
        }

        overlays.value[name] = {
            layer,
            visible: immediate,
        }
    }

    onMount(() => {
        add()
    })

    onDestroy(() => {
        remove()
    })

    beforeUpdate(() => {
        // remove()
    })

    export function getLayer() {
        return layer
    }
</script>

{#if layer}
    <slot {metadata}/>
{/if}
