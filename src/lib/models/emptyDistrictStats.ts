import keyBy from 'lodash-es/keyBy.js'

interface IDistrictStat {
    [key: string]: any;
}

const districts:IDistrictStat = [
    {district: 0, supervisor: 'Unassigned'},
    {district: 1, supervisor: 'Jennifer Kreitz'},
    {district: 2, supervisor: 'Rhonda Duggan'},
    {district: 3, supervisor: 'Bob Gardner'},
    {district: 4, supervisor: 'John Peters'},
    {district: 5, supervisor: 'Stacy Corless'},
]

const amended = districts.map(d => {
    return {
        ...d,
        population: 0,
        deviation: 0,
        deviationPerc: 0,
        IncorporatedTotal: 0,

        // demographics
        hispanic: 0,
        whiteOnly: 0,
        black: 0,
        indian: 0,
        asian: 0,
        islander: 0,
        other: 0,
        votingAge: 0,

        // percentage placeholders
        hispanicPerc: 0,
        whiteOnlyPerc: 0,
        blackPerc: 0,
        indianPerc: 0,
        asianPerc: 0,
        islanderPerc: 0,
        otherPerc: 0,
        votingAgePerc: 0,
        IncorporatedTotalPerc: 0,
    }
})

export default keyBy(amended, 'district')
