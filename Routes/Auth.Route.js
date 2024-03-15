const express = require("express")
const router = express.Router()
const createError = require('http-errors')
const { Registercollection,Logincollection}= require('../src/mongodb')
const {authSchema,authSchemaL} = require("../src/validation.schema")
const {signAccessToken} = require('../src/jwt.helper')

router.post("/register", async (req, res, next) => {
    try {
        // const { firstname, lastname, email, password } = req.body;

        // Check if email and password are provided
        // if (!email || !password) throw createError.BadRequest("Email and password are required.");
        const result = await authSchema.validateAsync(req.body)

        // Check if the user already exists
        const doesExist = await  Registercollection.findOne({ email: result.email });
        if (doesExist) throw createError.Conflict(`${result.email} is already registered.`);

        // Create a new user
        const newUser = new Registercollection(result); 
        const savedUser = await newUser.save();
        const accessToken = await signAccessToken(savedUser.id) 
        res.status(201).send({accessToken});
    } catch (error) {
        if(error.isJoi === true) 
            return next(createError[422])
        next(error);
    }
});

router.post("/login",async (req,res,next)=>{
    try {
        const result = await authSchemaL.validateAsync(req.body)
        const doesExist = await  Registercollection.findOne({ email: result.email });
        if (!doesExist) throw createError.NotFound("User not registered");

        const isMatch = await doesExist.isValidPassword(result.password)
        if(!isMatch) throw createError.Unauthorized("email/password not valid")
        // const LoginUser = new Logincollection(result); 
        // const savedUser = await LoginUser.save();
        const accessToken = await signAccessToken(doesExist.id)
        res.send({accessToken})
    } catch (error) {
        if(error.isJoi === true) 
            return next(createError.BadRequest("Invalid email/password"))
        next(error)
    }
})
router.post("/refresh-token",async (req,res,next)=>{
    res.send("refresh token route")
})
router.delete("/logout",async (req,res,next)=>{
    res.send("logout route")
})

module.exports = router