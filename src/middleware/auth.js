const jwt = require('jsonwebtoken')
const Users = require('../models/users')

const auth = async (req, res, next) => {
    try {
        const token = await getJwtToken(req)
        if (!token) {
            if (req.path !== '/') {
                return res.render('index', {
                    error: 'Please authenticate.'
                })
            } else {
                return res.render('index')
            }
        }
        // If you don't use cookie-parser then by default cookies are available at req.headers.cookie.
        //const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const user = await Users.findOne({ _id: decode._id, 'tokens.token': token })

        if (!user) {
            if (req.path !== '/') {
                return res.render('index', {
                    error: 'Please authenticate.'
                })
            } else {
                if (req.query.message) {
                    return res.render('index', {
                        message: req.query.message
                    })
                }
                return res.render('index')
            }
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.render('index')
    }

}

const getJwtToken = async (req) => {
    if (req && req.cookies) {
        return req.cookies['auth']
    }
    return ''
}
module.exports = auth