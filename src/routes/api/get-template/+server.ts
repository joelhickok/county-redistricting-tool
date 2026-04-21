import 'isomorphic-form-data'
import 'node-fetch'
import {queryFeatures} from '@esri/arcgis-rest-feature-service'
// import {arcgisToGeoJSON} from '@terraformer/arcgis'
// import keyBy from 'lodash-es/keyBy.js'
import simplify from '@turf/simplify'
// import {geometry} from '@turf/turf'
import {error, json} from '@sveltejs/kit'
import type {RequestHandler} from './$types'
import {ArcGISIdentityManager} from '@esri/arcgis-rest-request'
import {env} from '$env/dynamic/private'

const session = ArcGISIdentityManager.signIn({
    username: env.ARCGIS_USERNAME,
    password: env.ARCGIS_PASSWORD,
})

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export const GET: RequestHandler = async ({url}) => {

    const layerName = url.searchParams.get('name') || 'Mono_County_2020_Block_Demographics'
    const useSimplification = url.searchParams.get('simplify')

    const response = await queryFeatures({
        url: `https://services.arcgis.com/rQj5FcfuWPllzwY8/arcgis/rest/services/${encodeURIComponent(layerName)}/FeatureServer/0`,
        // where: "STATE_NAME = 'Alaska'",
        authentication: session,
        f: 'geojson',
        geometryPrecision: 4,
        outSR: '4326',
    }).catch(err => err)

    const filterNullGeom = ftr => ftr.geometry

    if (!response?.features?.length) {
        return json(response)
    }

    let filtered = {
        ...response,
        features: response.features.filter(filterNullGeom)
    }

    console.log(filtered.features.length)
    console.log('useSimplification')
    console.log(useSimplification)

    if (useSimplification && JSON.parse(useSimplification)) {
        console.log('simplify')
        console.log(simplify)
        filtered = simplify(filtered, {
            tolerance: 0.00005,
            highQuality: true,
            mutate: true,
        })
        console.log(filtered)
    }

    return json(filtered)
}
