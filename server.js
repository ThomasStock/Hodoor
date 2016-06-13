"use strict";

let message = 'initial message'

const express = require("express")
const http = require("http")
const bodyParser = require("body-parser")
const routes = require("./routes")
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/hodoor')

let userSchema = mongoose.Schema({
    name: String,
    code: String
});

let User = mongoose.model('User', userSchema)

let app = express()

let port = process.env.PORT || 8080

// http://www.askapache.com/htaccess/apache-speed-etags.html
app.disable("etag")

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

//app.use(express.cookieParser());
//app.use(express.session({secret: '1234567890QWERTY'}));

// parse application/json
app.use(bodyParser.json())

setupRoutes(app)

// Fire this bitch up (start our server)
let httpServer =  http.createServer(app).listen(port, function() {
    console.log("Expresss server listening on port " + port)
})


function setupRoutes(app) {

    app.post("/message", (req, res) => {
        message = req.body.message
        return res.sendStatus(200);
    });
    
    //validate a code
    app.get("/users/search/code/:code", (req, res) => {
        let code = req.params.code
        code = code.toUpperCase()
        User.find({code: code}, function (err, user) {
            if (err) return console.error(err);
            if(user){
                return res.send(user);
            }else{
                return res.sendStatus(404);    
            }
        })
    })
    
    //create a user
    app.post("/users", (req, res) => {
        let name = req.body.name
        let code = req.body.code
        let user = new User({ name: name, code: code})
        user.save(function (err, user) {
            if (err) return console.error(err);
            return res.sendStatus(201);
        })
    })
    
    //get all users
    app.get("/users", (req, res) => {
        
        User.find(function (err, users) {
            if (err) return console.error(err)
            return res.send(users)
        })
    })
}