const express = require("express");
const AuthRoute = require("../Routes/Auth.Route")
const NoteRoute = require("../Routes/noteRoute");
const morgan = require("morgan")
const app = express();
app.use(morgan('dev'))
const createError = require("http-errors")
require('dotenv').config()
//const collection = require("./mongodb")

const path = require("path");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const {verifyAccessToken} = require('./jwt.helper')
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));




const templatePath = path.join(__dirname, '../templates');
const publicPath = path.join(__dirname, '../public');

app.set('view engine', 'hbs');
app.set('views', templatePath);
app.use(express.static(publicPath));


app.get("/",verifyAccessToken, async(req, res,next) => {
  console.log(req.headers['authorization'])
  res.send('hello from express');
});
app.use('/auth',AuthRoute)
app.use('/note',NoteRoute)


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

