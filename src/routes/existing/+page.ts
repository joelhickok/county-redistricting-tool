import type {PageLoad} from './$types'
import {setDefaultRequestOptions} from '@esri/arcgis-rest-request'
import {getGroupContent} from '@esri/arcgis-rest-portal'
import 'isomorphic-form-data'
import {ArcGISIdentityManager} from '@esri/arcgis-rest-request'
import {env} from '$env/dynamic/private'

export const load: PageLoad = async ({params}) => {
    console.log(params)

    const authentication: ArcGISIdentityManager = await ArcGISIdentityManager.signIn({
        username: env.ARCGIS_USERNAME,
        password: env.ARCGIS_PASSWORD,
    })

    // setDefaultRequestOptions({fetch})

    const response = await getGroupContent('2a0e51f8d1064b0e8d7aa2d2b84d6acf', {
        // id: '2a0e51f8d1064b0e8d7aa2d2b84d6acf',
        paging: {
            start: 1,
            num: 400,
        },
        authentication
    }).catch(err => err)

    console.log(response)

    if (response.items) {
        return {
            items: response.items,
        }
    }

    return {
        error: true,
    }

}