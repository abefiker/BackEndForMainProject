const express = require("express")
const router = express.Router()
const createError = require('http-errors')
const collection = require('../src/mongodb')
const {authSchema} = require("../src/validation.schema")
const {signAccessToken} = require('../src/jwt.helper')

router.post("/register", async (req, res, next) => {
    try {
        // const { firstname, lastname, email, password } = req.body;

        // Check if email and password are provided
        // if (!email || !password) throw createError.BadRequest("Email and password are required.");
        const result = await authSchema.validateAsync(req.body)

        // Check if the user already exists
        const doesExist = await collection.findOne({ email: result.email });
        if (doesExist) throw createError.Conflict(`${result.email} is already registered.`);

        // Create a new user
        const newUser = new collection(result); 
        const savedUser = await newUser.save();
        const accessToken = await signAccessToken(savedUser.id) 
        res.status(201).send({accessToken});
    } catch (error) {
        if(error.isJoi === true) error.status = 422
        next(error);
    }
});

router.post("/login",async (req,res,next)=>{
    res.send("login route")
})
router.post("/refresh-token",async (req,res,next)=>{
    res.send("refresh token route")
})
router.delete("/logout",async (req,res,next)=>{
    res.send("logout route")
})

module.exports = router