
const mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/', {
    dbName: 'BackendForMainProject'
})
.then(()=>{
    console.log("mongogb connected");
})
.catch((err)=>console.log(err))

mongoose.connection.on('connected',()=>{
    console.log("mongoose connected to db")
})
mongoose.connection.on('error',(err)=>{
    console.log(err.message)
})
mongoose.connection.on('disconnected',()=>{
    console.log("mongoose connection is disconnected.")
})
process.on('SIGINT',async()=>{
    await mongoose.Connection.close()
    process.exit(0)
})

const LogInSchema = new mongoose.Schema({
    firstname :{
        type:String,
        required:true
    },
    lastname :{
        type:String,
        required:true
    },
    email:{
        type : String,
        required : true,
        lowercase : true,
        unique : true
    },
    password:{
        type:String,
        required:true
    }
})

const collection = new mongoose.model("logincollection",LogInSchema)
module.exports = collection