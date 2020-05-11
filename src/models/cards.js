const mongoose = require('mongoose')
const validator = require('validator')

const cardSchema = new mongoose.Schema({
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
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        required: true,
        default: 'todo',
        enum: ['todo', 'in_progress', 'done']
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    }
})

const Cards = mongoose.model('Cards', cardSchema)

module.exports = Cards