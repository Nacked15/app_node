var mongoose   = require('mongoose');
var Schema     = mongoose.Schema;

//- - - - - - - - C O N E X I O N - - - - - ->
mongoose.connect("mongodb://localhost/dbapp");

var user_schema = new Schema({
    name: String,
    username: String,
    password: {type: String, 
               required: "Dato requerido",
               minlength: [6, "El password debe tener minimo 6 caracteres"]},
    age: Number,
    email: {type: String, required: "Dato requerido"}
});

var User = mongoose.model("User", user_schema);

module.exports.User = User;