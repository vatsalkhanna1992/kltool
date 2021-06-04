const mongoose = require('mongoose')
const validator = require('validator')
const { CardSchema } = require('./cards')

const boardSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Please enter valid email.')
            }
        }
    },
    board_title: {
        type: String,
        required: true
    },
    board_description: {
        type: String,
        required: true
    },
    board_layout: {
        type: Number,
        default: 3
    },
    column_title: {
        type: Array
    },
    cards: [CardSchema]
}, {
    timestamps: true
})

const Boards = mongoose.model('Boards', boardSchema)

module.exports = Boards