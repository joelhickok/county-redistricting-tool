import ShortUniqueId from 'short-unique-id'
import {writable} from 'svelte/store'

export default class DistrictProposal {

    #uid

    constructor(data) {
        this.#uid = new ShortUniqueId({length: 10})
        this.id = this.#uid()
        console.log(data)
        const mapped = data.data.map(d => {
            return {
                ...d,
                planId: this.id,
            }
        })
        console.log(mapped[0])

        this.data = writable(mapped)
        this.fields = data.fields

        console.warn(`There are ${mapped.length} districts!`)
    }

}
