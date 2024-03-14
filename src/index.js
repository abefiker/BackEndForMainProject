const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs"); // Uncomment this line if you're using Handlebars
const collection = require("./mongodb");

app.use(express.urlencoded({ extended: false }));

const templatePath = path.join(__dirname, '../templates'); // Ensure the directory name is correct
const publicPath = path.join(__dirname, '../public');
console.log(publicPath);

app.set('view engine', 'hbs');
app.set('views', templatePath);
app.use(express.static(publicPath));

app.get("/", (req, res) => {
    res.render('login');
});

app.get("/signup", (req, res) => {
    res.render('signup');
});

app.post("/signup", async (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password
    };
    const check = await collection.findOne({email:req.body.email})
    try{
        if(check.email == req.body.email && check.password == req.body.password){
            res.send("User details already exists")
        }
        else{
            await collection.insertMany([data]);
        }
    }catch{
        res.send("wrong inputs")
    }
     res.status(201).render('home',{
        emailing : req.body.email
     });
});
app.post("/login",async (req,res)=>{
    try{
        const check = await collection.findOne({email:req.body.email})
        if(check.password == req.body.password){
            res.status(200).render('home',{
                emailing : req.body.email
            })
        }else{
            res.send('wrong password')
        }
    }   
    catch{
        res.send('wrong detail')
    } 
})

app.listen(3000, () => {
    console.log("server running at 3000");
});
