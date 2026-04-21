import color from 'color'
import jss from 'jss'
const unassignedColor = 'lightgrey'

const scheme1 = {
    0: unassignedColor,
    1: '#8f090a',
    2: '#377eb8',
    3: '#4daf4a',
    4: '#984ea3',
    5: '#ff7f00',
    text: '#FFF'
}

// const scheme2 = {
//     0: unassignedColor,
//     1: '#7fc97f',
//     2: '#beaed4',
//     3: '#fdc086',
//     4: '#ffff99',
//     5: '#386cb0',
//     text: '#000'
// }
//
// const scheme3 = {
//     0: unassignedColor,
//     1: '#1b9e77',
//     2: '#d95f02',
//     3: '#7570b3',
//     4: '#e7298a',
//     5: '#66a61e',
//     text: '#FFF'
// }


const districtColors = scheme1
export const colorScheme = districtColors

const style = {
    cardHeader: {
        color: 'white !important',
        // '&:hover': {
        //     background: 'black'
        // }
    },
}

Object.keys(districtColors).forEach(key => {
    if (key === 'text') return

    const colorValue = districtColors[key]

    style[`header-${key}`] = {
        extend: 'cardHeader',
        color: Number(key) === 0 ? 'black !important' : 'white !important',
        'background-color': `${colorValue} !important`,
    }

    let backgroundColor = color(`${colorValue}`)
    let fontColor = 'white !important'

    if (Number(key) === 0) {
        backgroundColor = color(`lightgrey`).lighten(0.5)
        fontColor = 'black !important'
    } else {
        backgroundColor = backgroundColor.lighten(0.4)
    }

    style[`body-${key}`] = {
        color: fontColor,
        'background-color': `${backgroundColor.hex()} !important`,
    }

    style[`border-${key}`] = {
        'border-color': `${backgroundColor.hex()} !important`,
        'border-width': '3px',
    }

    style[`text-${key}`] = {
        color: `${backgroundColor.hex()} !important`,
    }
})

export let stylesheet = jss.createStyleSheet(style)

export let classes = stylesheet.classes

export const attachTheme = () => {
    // console.log('stylesheet')
    // console.log(stylesheet)
    const {classes} = stylesheet.attach()
    return classes
}

export default classes
