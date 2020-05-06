const express = require('express')
const hbs = require('hbs')
const path = require('path')

const app = express()
const port = process.env.PORT || 3002
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup static directory to use.
app.use(express.static(publicDirectoryPath))
// Set views engine to use handlebars.
app.set('view engine', 'hbs')
// Set views path.
app.set('views', viewsPath)
// Register Partials.
hbs.registerPartials(partialsPath)

app.get('', (req, res) => {
    res.render('index')
})

// Start server.
app.listen(port, () => {
    console.log('Server is up and running at port '+ port)
})