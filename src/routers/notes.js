const express = require('express')
const Notes = require('../models/notes')
const auth = require('../middleware/auth')
const router = new express.Router()

// Fetch notes for the user.
router.get('/notes', auth, async (req, res) => {
    const username = req.user.username
    try {
        const notes = await Notes.find({ username })
        res.render('notes', {
            notes
        })
    } catch (e) {
        res.render('notes')
    }
})

// Fetch a note.
router.get('/fetch/note', auth, async (req, res) => {
    const note_id = req.query.id
    try {
        const note = await Notes.findById(note_id)
        res.send({
            note
        })
    } catch (e) {
        res.render('notes')
    }
})

// Add note.
router.post('/add/note', auth, async (req, res) => {
    const username = req.user.username
    const title = req.body.note_title
    const description = req.body.note_description
    try {
        const note = new Notes({username, title, description})
        await note.save()
        res.status(301).redirect('/notes')
    } catch (e) {
        res.status(400).send({
            error: 'Note cannot be added.'
        })
    }
})

module.exports = router