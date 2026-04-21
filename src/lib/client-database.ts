import {Dexie} from 'dexie'

const databaseName = 'ProposalDatabase'
let db = new Dexie(databaseName)

export default {

    async exists() {
        console.log('API: exists')
        return await Dexie.exists(databaseName)
    },

    async getExistingTable() {
        console.log('API: getExistingTable')
        await db.open()
        return db.tables[0]
    },

    async createProposalTables() {
        console.log('API: createProposalTables')
        try {
            if (await Dexie.exists(databaseName)) {
                await Dexie.delete(databaseName)
            }
            db = new Dexie(databaseName)
            db.version(1).stores({
                meta: '++id',
                data: '++properties.GEOID20, properties.District',
                // data: '&properties.GEOID20, properties.District',
            })
        } catch (err) {
            return err
        }
    },

    async addMeta({id}) {
        // await db.open()
        const table =  db.meta
        // const table = await db.table('meta')
        const result = await table.add({
            id,
        }).catch(err => err)
        await db.close()
        return result
    },

    async getMeta() {
        if (await Dexie.exists(databaseName)) {
            await db.open()
            const table = await db.table('meta')
            const result = await table.toArray()
            return result[0]
        }
        return new Error('Database does not exist yet.')
    },

    async updateMeta(info) {
        if (await Dexie.exists(databaseName)) {
            await db.open()
            const table = await db.table('meta')
            const result = await table.put(info)
            return result[0]
        }
        return new Error('Database does not exist yet.')
    },

    async bulkAdd(data) {
        await db.open()
        const table = await db.table('data')
        const result = await table.bulkAdd(data).catch(err => err)
        await db.close()
        return result
    },

    async bulkGet() {
        await db.open()

        const table = await db.table('data')
        const result = await table.toArray()
        db.close()
        return result
    },

    async put(item) {
        await db.open()

        const table = await db.table('data')
        const result = await table.put(item)
        db.close()
        return result
    },

    async bulkPut(items) {
        await db.open()

        const table = await db.table('data')
        const result = await table.bulkPut(items)
        db.close()
        return result
    },

}
