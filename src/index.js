const express = require("express");
const AuthRoute = require("../Routes/Auth.Route")
const morgan = require("morgan")
const app = express();
app.use(morgan('dev'))
const createError = require("http-errors")
require('dotenv').config()
const collection = require("./mongodb")

const path = require("path");
const hbs = require("hbs");
const bodyParser = require("body-parser");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));




const templatePath = path.join(__dirname, '../templates');
const publicPath = path.join(__dirname, '../public');

app.set('view engine', 'hbs');
app.set('views', templatePath);
app.use(express.static(publicPath));


app.get("/", (req, res) => {
  res.render('hello from express');
});
app.use('/auth',AuthRoute)


// app.get("/signup", (req, res) => {
//   res.render('signup');
// });

// app.post("/signup", async (req, res) => {
//   const data = {
//     firstname: req.body.firstname,
//     lastname: req.body.lastname,
//     email: req.body.email,
//     password: req.body.password
//   };
//   const check = await collection.findOne({ email: req.body.email })

//   if (check) {
//     return res.status(400).send("User details already exist");
//   }

//   await collection.insertMany([data]);
//   res.status(201).render('home', {
//     naming: req.body.firstname,
//     lnaming: req.body.lastname
//   });
// });

// app.post("/login", async (req, res) => {
//   try {
//     const check = await collection.findOne({ email: req.body.email });
//     if (check && check.password === req.body.password) {  // Use strict comparison (===)
//       res.status(200).render('home', {
//         naming: check.firstname,
//         lnaming: check.lastname
//       });
//     } else {
//       res.send('Invalid credentials'); // More informative message
//     }
//   } catch (error) {
//     console.error("Error during login:", error);
//     res.status(500).send('Internal server error'); // Generic error for client
//   }
// });
// app.use(async (req,res,next)=>{
//   next(createError.NotFound())
// })

// app.use((err,req,res,next)=>{
//   res.status(err.status || 500),
//   res.send({
//     error :{
//       status : err.status || 500,
//       message : err.message
//     }
//   })
// })
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

