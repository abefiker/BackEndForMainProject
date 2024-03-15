const JWT = require("jsonwebtoken")
const createError = require('http-errors')

module.exports = {
    signAccessToken: (userid) => {
        return new Promise((resolve, reject) => {
            const payload = {
            }
            const secret = process.env.ACCESS_TOKEN_SECRET ||'575a0febd3393c32bf3e2d33da524285c8bc61a1742e04ec686f5458a1151917'
            const options = {
                expiresIn: '1h',
                issuer:'https://oasis-lovat.vercel.app/',
                audience : userid,
            }
            JWT.sign(payload,secret,options,(err,token)=>{
                if(err){
                    console.log(err.message)
                    return reject(createError.InternalServerError())
                }
                resolve(token)
            })
        })
    }
}