import {browser} from '$app/environment'
import {derived} from 'svelte/store'
import sum from 'lodash-es/sum.js'
import groupBy from 'lodash-es/groupBy.js'
import cloneDeep from 'lodash-es/cloneDeep.js'
import emptyDistrictStats from '$lib/models/emptyDistrictStats.js'
import sumBy from 'lodash-es/sumBy.js'
import min from 'lodash-es/min.js'
import max from 'lodash-es/max.js'

const unassignedColor = 'white'

const districtScheme1 = {
    0: unassignedColor,
    1: '#E69F00',
    // 2: '#56B4E9',
    2: '#009E73',
    3: '#F0E442',
    4: '#0072B2',
    5: '#CC79A7',
    text: '#FFF'
}

class ReactiveStore {
    value: any = $state()

    constructor(init: any, itemKey?: string) {
        if (browser && localStorage.getItem(itemKey)) {
            this.value = JSON.parse(localStorage.getItem(itemKey))
        }
        if (init) {
            this.value = init
        }
    }
}

class BlocksStore extends ReactiveStore {
    // value: any = $state()

    blocksByDistrictGroup = $derived.by(() => {
        if (blockGeoJSON.value.length) {
            return groupBy(blockGeoJSON.value, 'properties.District')
        }
        return {}
    })

    constructor(init: any, itemKey?: string) {
        super(init, itemKey)
        if (browser && localStorage.getItem(itemKey)) {
            this.value = JSON.parse(localStorage.getItem(itemKey))
        }
        if (init) {
            this.value = init
        }
    }
}

interface PlanMeta {
    id?: string
}

export const planMeta: { value: PlanMeta } = $state({
    value: {},
})

export const overlayLayers = $state({
    value: [],
})

export const currentDistrict = $state({
    value: 1,
})

export const overlays: any = $state({
    value: {},
})

export const blocksLayer = $state({
    value: null,
})

export const isDrawing = $state({
    value: false,
})

export const districtColors = $state({
    value: districtScheme1,
})

export const classBreakInfos = $state({
    value: {},
})

export const mapState = $state({
    working: false,
    center: null,
    zoom: null,
})

export let selection = $state({
    value: 'point',
})

export let stats = $state({
    updating: false,
})

export let firstTime = $state({
    value: false,
})

export let displayName = $state({
    value: '',
})

export const blockGeoJSON = new BlocksStore([])

class TargetPerDistrict {
    value = $derived.by(() => {
        if (totalPopulation.value) {
            return totalPopulation.value / 5
        }
        return 0
    })
}

export const targetPerDistrict = new TargetPerDistrict()

class TotalPopulation {
    value = $derived.by(() => {
        if (blockGeoJSON.value.length) {
            return sum(blockGeoJSON.value.map(d => d.properties.P0010001))
        }
        return 0
    })
}

export const totalPopulation = new TotalPopulation()

class SummaryStatisticsStore {
    value = $derived.by(() => {
        const stats = cloneDeep(emptyDistrictStats)

        if (blockGeoJSON.blocksByDistrictGroup) {
            const fixedPerc = 1
            const isIncorporated = value => value.properties.Incorporated === 'Y'

            Object.keys(blockGeoJSON.blocksByDistrictGroup).forEach(district => {
                stats[district].population = sumBy(blockGeoJSON.blocksByDistrictGroup[district], 'properties.P0010001')
                if (stats[district].population) {
                    stats[district].deviation = (targetPerDistrict.value - stats[district].population) * -1
                } else {
                    stats[district].deviation = 0
                }

                stats[district].deviationPerc
                    = ((targetPerDistrict.value - stats[district].population) * -1) / totalPopulation.value

                if (stats[district].population) {
                    stats[district].votingAge = sumBy(blockGeoJSON.blocksByDistrictGroup[district], 'properties.P0030001')
                    stats[district].votingAgePerc = (stats[district].votingAge / stats[district].population * 100).toFixed(fixedPerc)
                }

                if (stats[district].votingAge) {
                    stats[district].hispanic = sumBy(blockGeoJSON.blocksByDistrictGroup[district], 'properties.P0020002')
                    stats[district].hispanicPerc = (stats[district].hispanic / stats[district].votingAge * 100).toFixed(fixedPerc)
                    stats[district].whiteOnly = sumBy(blockGeoJSON.blocksByDistrictGroup[district], 'properties.P0010003')
                    stats[district].whiteOnlyPerc = (stats[district].whiteOnly / stats[district].votingAge * 100).toFixed(fixedPerc)
                    stats[district].black = sumBy(blockGeoJSON.blocksByDistrictGroup[district], 'properties.P0010004')
                    stats[district].blackPerc = (stats[district].black / stats[district].votingAge * 100).toFixed(fixedPerc)
                    stats[district].indian = sumBy(blockGeoJSON.blocksByDistrictGroup[district], 'properties.P0010005')
                    stats[district].indianPerc = (stats[district].indian / stats[district].votingAge * 100).toFixed(fixedPerc)
                    stats[district].asian = sumBy(blockGeoJSON.blocksByDistrictGroup[district], 'properties.P0010006')
                    stats[district].asianPerc = (stats[district].asian / stats[district].votingAge * 100).toFixed(fixedPerc)
                    stats[district].islander = sumBy(blockGeoJSON.blocksByDistrictGroup[district], 'properties.P0010007')
                    stats[district].islanderPerc = (stats[district].islander / stats[district].votingAge * 100).toFixed(fixedPerc)
                    stats[district].other = sumBy(blockGeoJSON.blocksByDistrictGroup[district], 'properties.P0010008')
                    stats[district].otherPerc = (stats[district].other / stats[district].votingAge * 100).toFixed(fixedPerc)
                }

                stats[district].IncorporatedTotal = sumBy(blockGeoJSON.blocksByDistrictGroup[district].filter(isIncorporated), 'properties.P0010001')
                stats[district].IncorporatedTotalPerc = (stats[district].IncorporatedTotal / stats[district].population * 100).toFixed(fixedPerc)
            })
        }
        return stats
    })
}

export const summaryStatistics = new SummaryStatisticsStore()

class Deviation {
    value = $derived.by(() => {
        const deviations = Object.keys(summaryStatistics.value).slice(1, 6).map(val => {
            return summaryStatistics.value[val].deviation
        })

        const minDeviation = min(deviations)
        const maxDeviation = max(deviations)

        const deviationRange = maxDeviation - minDeviation
        const totalDeviationString = (deviationRange / targetPerDistrict.value) * 100

        return {
            minDeviation,
            maxDeviation,
            deviationRange,
            totalDeviation: totalDeviationString,
        }
    })
}

export const deviation = new Deviation()


class Warnings {
    value = $derived.by(() => {
        return {
            unassignedBlocksPresent: blockGeoJSON.blocksByDistrictGroup[0] && blockGeoJSON.blocksByDistrictGroup[0].length,
            excessiveDeviation: deviation.value.totalDeviation > 10,
        }
    })
}

export const warnings = new Warnings()

