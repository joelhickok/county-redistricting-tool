<script>
    import {setContext} from 'svelte'
    // import VectorTileLayer from 'src/components/mapping/Layer.VectorTileLayer.svelte'
    import EsriFeatureLayer from '$lib/components/mapping/Layer.EsriFeatureLayer.svelte'
    import Existing from '$lib/components/mapping/Layer.Existing.svelte'
    import Overlays from '$lib/components/mapping/Control.Overlays.svelte'
    import BlockSelection from '$lib/components/mapping/Control.BlockSelection.svelte'
    import DefaultExtent from '$lib/components/mapping/Control.DefaultExtent.svelte'
    import LayerBlocks from '$lib/components/mapping/Layer.Blocks.svelte'
    import Highlight from '$lib/components/mapping/Highlight.svelte'
    import Legend from '$lib/components/mapping/Legend.svelte'

    import {currentExistingProposal,} from '$lib/store.svelte'
    import {mapState, classBreakInfos} from '$lib/masterStore.svelte.ts';

    // import EventBridge from '$lib/EventBridge'

    // const dispatch = createEventDispatcher()

    // export let events = []

    // let eventBridge

    // $: {
    //     console.log($classBreakInfos)
    // }

    export let classNames = ''
    let L
    let map = null
    const defaultCenter = {
        lat: 37.88408107826034,
        lng: -118.7953495731962
    }

    let mapOptions = {
        center: mapState?.center || defaultCenter,
        zoom: mapState?.zoom || 9,
        maxZoom: 21,
        zoomControl: false,
    }

    setContext(L, {
        getMap: () => map,
    })

    async function initialize(container) {
        const module = await import('leaflet')
        // await import('esri-leaflet-renderers')
        L = module.default
        const {basemapLayer} = await import('esri-leaflet')
        await import('@geoman-io/leaflet-geoman-free')

        map = L.map(container, mapOptions)
        // eventBridge = new EventBridge(map, dispatch, events)

        // Streets
        // Topographic
        // Gray
        // DarkGray
        const topo = basemapLayer('Topographic').addTo(map)

        L.control.zoom({
            position: 'topleft'
        }).addTo(map)

        // const baseLayers = {
        //     'topo': topo,
        // }
        //
        // const overlays = {}
        //
        // L.control.layers(baseLayers, overlays).addTo(map)

        map.on('moveend', () => {
            const center = map.getCenter()
            mapState.center = {
                lat: center.lat,
                lng: center.lng,
            }
            mapState.zoom = map.getZoom()
        })

        map.on('overlayadd', (e) => {
            console.log('added layer')
            console.log(e)
        })

        map.on('keydown', async e => {
            console.log('keydown')
            console.log(e)
        })

        return {
            destroy: () => {
                // eventBridge.unregister()
                map.remove()
                // map = null
            },
        }
    }

    export function getMap() {
        return map
    }
</script>

<div id="mapEl" use:initialize class="{classNames}">
    {#if map}
        <DefaultExtent position="topleft"/>
        <BlockSelection position="topright"/>
        <Overlays position="topleft"/>

        <Legend/>

        <EsriFeatureLayer name="Population Density by Block Group"
                          let:classBreakInfos
                          immediate={false}
                          legend={true}
                          color="white"
                          nativeRendering={true}
                          labels={true}
                          minLabelZoom={14}
                          url="https://services.arcgis.com/rQj5FcfuWPllzwY8/arcgis/rest/services/Mono_County_2020_Block_Demographics/FeatureServer/0"
        />

        <EsriFeatureLayer name="Communities of Interest"
                          color="green"
                          url="https://services.arcgis.com/rQj5FcfuWPllzwY8/arcgis/rest/services/survey123_67bb729d6bb744e886019b2b430010d6_stakeholder/FeatureServer/0"
        />

        <EsriFeatureLayer labels={true}
                          labelField="District"
                          labelPrePend="District"
                          name="Supervisor Districts"
                          color="gold"
                          group="Districts"
                          url="https://gis.mono.ca.gov/webgis/rest/services/OpenData/Districts/MapServer/20"
        />
        <EsriFeatureLayer labels={true}
                          labelField="FD_Name"
                          name="Fire Districts"
                          color="red"
                          group="Districts"
                          url="https://gis.mono.ca.gov/webgis/rest/services/OpenData/Districts/MapServer/7"
        />
        <EsriFeatureLayer labels={true}
                          labelField="CSD_Name"
                          name="Community Service Districts"
                          color="navy"
                          group="Districts"
                          url="https://gis.mono.ca.gov/webgis/rest/services/OpenData/Districts/MapServer/5"
        />

        <EsriFeatureLayer name="Asian Alone"
                          labels={true}
                          minLabelZoom={14}
                          nativeRendering={true}
                          legend={true}
                          group="Demographics Layers"
                          url="https://services.arcgis.com/rQj5FcfuWPllzwY8/arcgis/rest/services/Asian_View/FeatureServer/0"
        />
        <EsriFeatureLayer name="Native Hawaiian and Other Pacific Islander Alone"
                          labels={true}
                          minLabelZoom={14}
                          nativeRendering={true}
                          legend={true}
                          group="Demographics Layers"
                          url="https://services.arcgis.com/rQj5FcfuWPllzwY8/arcgis/rest/services/Native_Hawaiian_and_Other_Pacific_Islander_View/FeatureServer/0"
        />
        <EsriFeatureLayer name="Black or African American Alone"
                          labels={true}
                          minLabelZoom={14}
                          nativeRendering={true}
                          legend={true}
                          group="Demographics Layers"
                          url="https://services.arcgis.com/rQj5FcfuWPllzwY8/arcgis/rest/services/Black_or_African_American_alone/FeatureServer/0"
        />
        <EsriFeatureLayer name="American Indian and Alaska Native Alone"
                          labels={true}
                          minLabelZoom={14}
                          nativeRendering={true}
                          legend={true}
                          group="Demographics Layers"
                          url="https://services.arcgis.com/rQj5FcfuWPllzwY8/arcgis/rest/services/American_Indian_and_Alaska_Native_View/FeatureServer/0"
        />
        <EsriFeatureLayer name="Some Other Race"
                          labels={true}
                          minLabelZoom={14}
                          nativeRendering={true}
                          legend={true}
                          group="Demographics Layers"
                          url="https://services.arcgis.com/rQj5FcfuWPllzwY8/arcgis/rest/services/Some_Other_Race_View/FeatureServer/0"
        />
        <EsriFeatureLayer name="Hispanic Population"
                          labels={true}
                          minLabelZoom={14}
                          nativeRendering={true}
                          legend={true}
                          group="Demographics Layers"
                          url="https://services.arcgis.com/rQj5FcfuWPllzwY8/arcgis/rest/services/Hispanic_Population_View/FeatureServer/0"
        />
        <EsriFeatureLayer name="Voting Age Population (18)"
                          labels={true}
                          minLabelZoom={14}
                          nativeRendering={true}
                          legend={true}
                          group="Demographics Layers"
                          url="https://services.arcgis.com/rQj5FcfuWPllzwY8/arcgis/rest/services/Voting_Age_18_and_Over_View/FeatureServer/0"
        />
        <EsriFeatureLayer name="White Alone"
                          labels={true}
                          minLabelZoom={14}
                          nativeRendering={true}
                          legend={true}
                          group="Demographics Layers"
                          url="https://services.arcgis.com/rQj5FcfuWPllzwY8/arcgis/rest/services/White_Alone_View/FeatureServer/0"
        />


        {#if $currentExistingProposal}
            <Existing name="Existing Proposal"/>
        {/if}

        <LayerBlocks immediate={true} name="Working Proposal"/>

        <Highlight/>

        <slot/>
    {/if}
</div>

<style lang="scss" global>
  #mapEl {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
