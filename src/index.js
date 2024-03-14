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
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password
    };
    const check = await collection.findOne({ email: req.body.email })
  
    if (check) {
      // User already exists
      return res.status(400).send("User details already exist"); 
    }
  
    await collection.insertMany([data]);
    res.status(201).render('home', {
      naming: req.body.firstname,
      lnaming : req.body.lastname
    });
  });
  
  app.post("/login", async (req, res) => {
    try {
      const check = await collection.findOne({ email: req.body.email });
      if (check && check.password === req.body.password) {  // Use strict comparison (===)
        res.status(200).render('home', {
          firstname: check.firstname,
          lastname: check.lastname
        });
      } else {
        res.send('Invalid credentials'); // More informative message
      }
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).send('Internal server error'); // Generic error for client
    }
  });
  
app.listen(3000, () => {
    console.log("server running at 3000");
});
