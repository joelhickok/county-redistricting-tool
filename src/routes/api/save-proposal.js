import 'isomorphic-form-data'
import 'node-fetch'
import snakeCase from 'voca/snake_case.js'

import layerTemplate from '$lib/layerTemplate'
import fieldSchema from '$lib/fieldSchema'
import {parse} from 'terraformer-arcgis-parser'
import {setDefaultRequestOptions,} from '@esri/arcgis-rest-request'
import {addFeatures, createFeatureService, addToServiceDefinition} from '@esri/arcgis-rest-feature-service'
import {setItemAccess, getItem, updateItem, shareItemWithGroup} from '@esri/arcgis-rest-portal'
import {ArcGISIdentityManager} from '@esri/arcgis-rest-request'
import {env} from '$env/dynamic/private';

// setDefaultRequestOptions({fetch})

const authentication = ArcGISIdentityManager.signIn({
    username: env.ARCGIS_USERNAME,
    password: env.ARCGIS_PASSWORD,
})

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post({request, url, params, locals}) {
    console.log(request)
    const body = await request.formData()

    // console.log('Save has been disabled.')

    // return {
    //     body: {
    //         error: false,
    //         message: 'Save has been disabled.',
    //     }
    // }

    console.log(`There are ${body.features.length} features to save from the proposal.`)

    try {
        const {planMeta, features} = body
        console.log(planMeta)
        console.log(features.length)

        const folderId = '313cfbd8e16049a5a237cb1b597674ad'
        const owner = 'joel_hickok'
        const newName = snakeCase(planMeta.name)
        let newItemId = null

        const item = {
            name: newName,
            capabilities: 'Query',
            // categories: [],
            access: 'public',
        }

        const createFeatureServiceResponse = await createFeatureService({
            authentication,
            item,
            folderId,
            owner,
        })

        if (!createFeatureServiceResponse.success) {
            console.log('Error creating feature service')
            // console.log(createFeatureServiceResponse)
        }

        // console.log(createFeatureServiceResponse)
        newItemId = createFeatureServiceResponse.itemId
        // console.log(createFeatureServiceResponse)
        console.log(`Created new feature service:\n${createFeatureServiceResponse.serviceurl}`)

        if (!createFeatureServiceResponse?.success) {
            console.log(createFeatureServiceResponse.message)
            const regex = new RegExp(/already exists/)
            if (regex.test(createFeatureServiceResponse.message)) {
                console.log('Service already exists, return error message.')
                return {
                    body: {
                        error: true,
                        message: 'This Proposal Name is already used.  Please select another name.',
                        createFeatureServiceResponse,
                    }
                }
            }
            return {
                body: {
                    error: true,
                    message: 'Unknown error occurred',
                    createFeatureServiceResponse,
                }
            }
        }

        layerTemplate.layers[0].name = newName
        layerTemplate.layers[0].displayField = 'District'
        layerTemplate.layers[0].fields = fieldSchema
        // layerTemplate.layers[0].fields = serviceAdminInfoResponseForExistingLayer.layers[0].fields
        layerTemplate.layers[0].extent = {
            'xmin': -119.65150900034008,
            'ymin': 37.462588000335984,
            'xmax': -117.83272600020472,
            'ymax': 38.713211999634154,
            'spatialReference': {
                'wkid': 4326,
                'latestWkid': 4326
            }
        }

        const addToServiceDefinitionResponse =
            await addToServiceDefinition(createFeatureServiceResponse.serviceurl, {
                authentication,
                ...layerTemplate,
            })
        if (!addToServiceDefinitionResponse.success) {
            console.log('Error creating new layer in feature service')
            console.log(addToServiceDefinitionResponse)
        }
        console.log(`Success Creating New Feature Service Layer: ${addToServiceDefinitionResponse.layers[0].name}`)


        const getItemResponse = await getItem(newItemId, {authentication})
        console.log('getItemResponse')
        console.log(getItemResponse)


        console.log('Updating item details...')
        const updateItemResponse = await updateItem({
            item: {
                ...getItemResponse,
                description: planMeta.description,
                licenseInfo: 'This geographic data is not licensed for redistribution.  It will self-destruct in 960 days.',
                title: body.planMeta.name,
                snippet: 'A custom redistricting proposal submitted by a user in the public.',
                tags: ['redistricting', 'census', 'proposal'],
                // categories: ["/Categories/Basemaps", "/Categories/Transportation"],
            },
            authentication,
        })
        console.log('Done updating item')
        if (updateItemResponse.originalMessage) {
            console.log(updateItemResponse.originalMessage)
        }


        console.log(`Set item access to public.`)
        const setItemAccessResponse = await setItemAccess({
            id: newItemId,
            access: 'public',
            owner: 'joel_hickok',
            confirmItemControl: true,
            authentication,
        })
        console.log(setItemAccessResponse)
        console.log(`Done setting access,  ${setItemAccessResponse.itemId}`)


        console.log(`Share item with group.`)
        const shareItemWithGroupResponse = await shareItemWithGroup({
            id: newItemId,
            groupId: '2a0e51f8d1064b0e8d7aa2d2b84d6acf',
            owner: 'joel_hickok',
            authentication
        })
        console.log(shareItemWithGroupResponse)
        console.log(`Done sharing group,  ${shareItemWithGroupResponse.itemId}`)

        const arcgis = body.features.map(feature => {
            delete feature.properties.OBJECTID
            delete feature.properties.Shape__Area
            delete feature.properties.Shape__Length
            return geojsonToArcGIS(feature)
        })

        const updateFeaturesResponse = await addFeatures({
            authentication,
            url: `${createFeatureServiceResponse.serviceurl}/0`,
            features: arcgis,
        })

        if (!updateFeaturesResponse.addResults) {
            console.log('Error adding features')
            console.log('updateFeaturesResponse')
            console.log(updateFeaturesResponse)
        }

        console.log(`Update New Feature Layer With ${updateFeaturesResponse.addResults.length} features`)

        if (updateFeaturesResponse) {
            return {
                body: {
                    message: `Saved ${body.features.length} features in this proposal to ArcGIS Online Item ID: ${newItemId}.`,
                    // response: updateFeaturesResponse,
                    itemId: newItemId,
                }
            }
        }
    } catch (err) {
        console.log(err)

        return {
            body: {
                error: true,
                message: err.originalMessage,
            }
        }

    }

}
