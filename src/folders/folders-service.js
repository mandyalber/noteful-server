//Write Folder service object for the new tables.
const FoldersService = {
    getAllFolders(knex) {
        return knex.select('*').from('noteful_folders')
    },
    insertFolder(knex, newFolder) {
        return knex.insert(newFolder).into('noteful_folders').returning('*').then(rows => { return rows[0] })
    },
    getById(knex, folderId) {
        return knex.from('noteful_folders').select('*').where('folderId', folderId).first()
    },    
}

module.exports = FoldersService