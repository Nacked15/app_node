//- - - - - - - - M O D U L E S - - - - - - ->
var express    = require("express");
var bodyParser = require("body-parser"); //leer parametros enviados desde un form
var User       = require("./models/user").User;
// var session    = require('express-session'); //Env. Production
var CookieSession    = require('cookie-session'); //Env. Development
var Imagen     = require("./models/imagenes");
var router_app = require("./routes_app");
var session_middleware = require("./middlewares/session");
var methodOverride     = require("method-override");
var app        = express();

//--------- M I D L E W A R E S ------------->
app.use("/public", express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
//app.use(session({secret: "1a2b3c4d5e6f7g8h9i", resave: false, saveUninitialized: false}));
app.use(CookieSession({
    name: "session",
    keys: ["llave-1", "llave-2"]
}));

app.set("view engine", "jade");


//-------------- R O U T E S ----------------->

//Load index
app.get("/", function(req, res){
    res.render("index");
});

//Load login form
app.get("/signup", function(req, res){
    res.render("signup");
});

//login user
app.post("/users", function(req, res){
    //Crear nuevo usuario pasando los datos obtenidos desde el form
    var user = new User({name:     req.body.name,
                         age:      req.body.age,
                         username: req.body.username,
                         email:    req.body.email, 
                         password: req.body.password});

    //====== Callbaks ======                  
    //user.save(function(err, user, rows){
    //    res.send("Status save data: Ok");
    //});


    //====== Promises ======
    user.save().then(function(usr){
        res.render("login");
    }, function(erro){
        if(erro){
            res.red("Status save data: Failed");
        }
    });
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/loggedin", function(req, res){
    User.findOne({email: req.body.email, password: req.body.password},
        function(err, user){
            req.session.user_id = user._id;
            res.redirect("/app");
        }
    );
});

//Rutas Modulares
app.use("/app", session_middleware)
app.use("/app", router_app);

app.listen(3000);