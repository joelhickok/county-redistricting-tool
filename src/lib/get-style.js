export default (districtColors, properties) => {
    const district = Number(properties.District)

    return {
        // stroke: district === 0,

        // weight: 1,
        weight: district === 0 ? 1 : 1,

        color: district === 0
            ? 'black'
            : 'black',

        fillColor: districtColors[district] || 'transparent',

        fillOpacity: 0.5,

        // className: `primary-${properties.District}`
    }
}
