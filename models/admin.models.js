const mongo = require("mongoose");

const adminSchema = new mongo.Schema({
    name:{
        type:String,
        required:true
    },
})

module.exports = mongo.model("Admin",adminSchema);