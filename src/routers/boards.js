const express = require('express')
const Boards = require('../models/boards')
const { Cards } = require('../models/cards')
const auth = require('../middleware/auth')
const router = new express.Router()
const hbs = require('hbs')

// Fetch Progress Board for a user.
router.get('/progress-board', auth, async (req, res) => {
    const username = req.user.username
    try {
        const cards = await Cards.find({ username })
        res.render('kanban', {
            cards
        })
    } catch (e) {
        res.render('kanban')
    }
})

// Add new board.
router.post('/add/board', auth, async (req, res) => {
    const username = req.user.username
    const board_title = req.body.board_title
    const board_description = req.body.board_description
    const board_layout = req.body.board_layout
    var column_title = [];
    for (var i = 0; i < board_layout; i++) {
        var column = req.body['column[' + i + ']']
        if (column && column != '') {
            column_title[i] = column
        }
    }
    const board = new Boards({
        username,
        board_title,
        board_description,
        board_layout,
        column_title
    })
    try {
        await board.save()
        res.redirect('/board/' + board.id)
    } catch (e) {
        res.send({
            error: 'Board cannot be created'
        })
    }
})

// Fetch board.
router.get('/board/:id', auth, async (req, res) => {
    const board_id = req.params.id
    try {
        const board = await Boards.findById(board_id)
        if (board.username !== req.user.username) {
            return res.send({
                error: 'Please provide correct board id.'
            })
        }
        var layout
        let col_length = board.column_title.length
        if (col_length <= 3) {
            layout = '3'
        }
        else if (col_length > 3 && col_length <= 6) {
            layout = '6'
        }
        else if (col_length > 6 && col_length <= 12) {
            layout = '12'
        }
        res.render('board', {
            col_layout: layout,
            board
        })
    } catch (e) {
        res.send({
            error: 'Board not found.'
        })
    }
})


// Fetch all boards.
router.get('/boards', auth, async (req, res) => {
    const username = req.user.username
    try {
        const boards = await Boards.find({username})
        if (!boards.length) {
            return res.render('boards', {
                message: "You don't have any board. Create a board now."
            })
        }
        res.render('boards', {
            boards
        })
    } catch (e) {
        res.render('boards', {
            error: 'No boards found!'
        })
    }
})

// Add card on board through ajax.
router.post('/new/card', auth, async (req, res) => {
    const username = req.user.username
    const title = req.body.card_title
    const description = req.body.card_description
    const status = req.body.card_status
    const board_id = req.body.board_id
    const card = new Cards({
        username,
        title,
        description,
        status
    })
    try {
        await Boards.findByIdAndUpdate(board_id, {
            $push: {
                cards: card
            }
        })
        res.redirect('/board/' + board_id)
    } catch (e) {
        res.render('kanban')
    }
})

// Register helper for handlebars.
hbs.registerHelper('columnsLength', function(layout, length, options) {
    if (layout == length) {
        return options.fn(this)
    }
})

module.exports = router