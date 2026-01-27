const express = require("express")
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const bodyParser = require("body-parser");
const authRoutes = require("./auth/auth")
const port = process.env.PORT || 5000;
const path = require("path");

const MONGO_URL = "mongodb://127.0.0.1:27017/CareerHub"

main().then(()=>{
    console.log("Connected to Database")
}).catch((err)=>{
    console.log(err)
})
 async function main(){
   await mongoose.connect(MONGO_URL);
 }


 // Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24*60*60*1000 }
}));

 app.set("view engine","ejs" );
 app.set("views", path.join(__dirname, "views"));
 app.use(express.urlencoded({extended:true}));
 app.use(methodOverride("_method"));
 app.engine('ejs', ejsMate)
 app.use(express.static(path.join(__dirname, "/public")));
 app.use('/', authRoutes);


//  main route
 app.get("/", (req,res)=>{
    res.send("Root is working")
})


// login
app.get('/home/login', (req, res) => {
  res.redirect('/login');
});

// homepage route
app.get("/home", (req,res)=>{ 
    res.render("home.ejs")
})




app.listen(port, () => console.log(`Server running on port ${port}`));