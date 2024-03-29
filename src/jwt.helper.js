const JWT = require("jsonwebtoken")
const createError = require('http-errors')

module.exports = {
    signAccessToken: (userid) => {
        return new Promise((resolve, reject) => {
            const payload = {
            }
            const secret = process.env.ACCESS_TOKEN_SECRET || '575a0febd3393c32bf3e2d33da524285c8bc61a1742e04ec686f5458a1151917'
            const options = {
                expiresIn: '50s',
                issuer: 'https://oasis-lovat.vercel.app/',
                audience: userid,
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message)
                    return reject(createError.InternalServerError())
                }
                resolve(token)
            })
        })
    },
    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization']) return next(createError.Unauthorized())
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET || '575a0febd3393c32bf3e2d33da524285c8bc61a1742e04ec686f5458a1151917', (err, payload) => {
            if (err) {
                if (err.name === 'JsonWebTokenError') {
                    return next(createError.Unauthorized())
                } else {
                    return next(createError.Unauthorized(err.message))
                }
            }
            req.payload = payload
            next()
        })
    }, signRefreshToken: (userid) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.REFRESH_TOKEN_SECRET || 'a36beff049c1795c3fd1fd41e50ee1aca09478db930d99adf05fc370b3207909'
            const options = {
                expiresIn: '1y',
                issuer: 'https://oasis-lovat.vercel.app/',
                audience: userid,
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message)
                    return reject(createError.InternalServerError())
                }
                resolve(token)
            })
        })
    },
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'a36beff049c1795c3fd1fd41e50ee1aca09478db930d99adf05fc370b3207909', (err, payload) => {
                if (err) return reject(createError.Unauthorized())
                const userid = payload.aud
                resolve(userid)
            })
        })
    }
}