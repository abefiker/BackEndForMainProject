
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
mongoose.connect('mongodb://127.0.0.1:27017/', {
    dbName: 'BackendForMainProject'
})
    .then(() => {
        console.log("mongogb connected");
    })
    .catch((err) => console.log(err))

mongoose.connection.on('connected', () => {
    console.log("mongoose connected to db")
})
mongoose.connection.on('error', (err) => {
    console.log(err.message)
})
mongoose.connection.on('disconnected', () => {
    console.log("mongoose connection is disconnected.")
})
process.on('SIGINT', async () => {
    await mongoose.Connection.close()
    process.exit(0)
})

const RegisterSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});
const LoginSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

RegisterSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    } catch (error) {
        next(error)
    }
})
RegisterSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}
LoginSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    } catch (error) {
        next(error)
    }
})


const Registercollection = new mongoose.model("RegisterCollection", RegisterSchema)
const Logincollection = new mongoose.model("LoginCollection", LoginSchema)
module.exports = {
    Registercollection,
    Logincollection
}