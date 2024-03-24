const {authSchema,authSchemaL} = require("../utis/validation.schema")
const {Registercollection}= require('../src/mongodb')
const createError = require('http-errors')
const {signAccessToken,signRefreshToken,verifyRefreshToken} = require('../src/jwt.helper')
exports.register = async (req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body)
        // Check if the user already exists
        const doesExist = await  Registercollection.findOne({ email: result.email });
        if (doesExist) throw createError.Conflict(`${result.email} is already registered.`);

        // Create a new user
        const newUser = new Registercollection(result); 
        const savedUser = await newUser.save();
        const accessToken = await signAccessToken(savedUser.id) 
        const refreshToken = await signRefreshToken(savedUser.id)
        res.status(201).send({accessToken,refreshToken});
    } catch (error) {
        if(error.isJoi === true) 
            return next(createError[422])
        next(error);
    }
}
exports.login = async (req,res,next)=>{
    try {
        const result = await authSchemaL.validateAsync(req.body)
        const doesExist = await  Registercollection.findOne({ email: result.email });
        if (!doesExist) throw createError.NotFound("User not registered");

        const isMatch = await doesExist.isValidPassword(result.password)
        if(!isMatch) throw createError.Unauthorized("email/password not valid")
        // const LoginUser = new Logincollection(result); 
        // const savedUser = await LoginUser.save();
        const accessToken = await signAccessToken(doesExist.id)
        const refreshToken = await signRefreshToken(doesExist.id)
        res.send({accessToken,refreshToken})
    } catch (error) {
        if(error.isJoi === true) 
            return next(createError.BadRequest("Invalid email/password"))
        next(error)
    }
}
exports.refreshToken = async (req,res,next)=>{
    try {
        const {refreshToken} = req.body
        if(!refreshToken) throw createError.BadRequest("refresh-token not found")
        const userid = await verifyRefreshToken(refreshToken)
        const accessToken = await signAccessToken(userid)
        const refreshTok = await signRefreshToken(userid)
        res.send({accessToken:accessToken,refreshToken:refreshTok})
    } catch (error) {
        next(error)
    }
}
exports.logout = async (req,res,next)=>{
    res.send("logout route")
}