//Write routers to perform CRUD operations for Notes
const express = require('express')
const xss = require('xss')
const path = require('path')
const NotesService = require('./notes-service')

const notesRouter = express.Router()
const jsonParser = express.json()

const serializeNote = note => ({
    id: note.id,
    name: xss(note.name),
    content: xss(note.content),
    modified: note.modified,
    folderId: note.folderId,
})

notesRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        NotesService.getAllNotes(knexInstance)
            .then(notes => {
                res.json(notes.map(serializeNote))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name, modified, content, folderId } = req.body
        const newNote = { name, modified, content, folderId }

        for (const [key, value] of Object.entries(newNote))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })

        NotesService.insertNote(req.app.get('db'), newNote)
            .then(note => {
                res.status(201).location(path.posix.join(req.originalUrl, `/${note.id}`)).json(serializeNote(note))
            })
            .catch(next)
    })

notesRouter
    .route('/:id')
    .all((req, res, next) => {
        NotesService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(note => {
                if (!note) {
                    return res.status(404).json({
                        error: { message: `Note doesn't exist` }
                    })
                }
                res.note = note
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeNote(res.note))
    })
    .delete((req, res, next) => {
        NotesService.deleteNote(
            req.app.get('db'),
            req.params.id
        )
            .then(numRowsAffected => {
                res.status(204).send('Note has been deleted')
            })
            .catch(next)
    })

module.exports = notesRouter