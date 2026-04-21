<script lang="ts">
    import {getContext, onMount, onDestroy, beforeUpdate} from 'svelte'

    export let position = 'topright'
    export let options = {}
    export let center = [38.0758, -118.8102]
    export let zoom = 9

    let control
    let L
    const {getMap} = getContext(L)

    const removeControl = () => {
        if (control) {
            control.remove()
        }
    }

    const addControl = async () => {
        const module = await import('leaflet')
        L = module.default

        // https://www.npmjs.com/package/leaflet.defaultextent
        await import('leaflet.defaultextent')
        const control = L.control.defaultExtent(options).addTo(getMap())
        control.setPosition(position)
        control.setCenter(center)
        control.setZoom(zoom)
    }

    onMount(async () => {
        await addControl()
        const el = document.querySelector('.leaflet-control-defaultextent-toggle')

        el.style.backgroundImage = `url('/images/leaflet.defaultextent.png')`

    })

    onDestroy(() => {
        removeControl()
    })

    beforeUpdate(() => {
        // removeControl()
    })

    export function getControl() {
        return control
    }
</script>
