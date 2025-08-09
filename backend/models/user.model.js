import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    Username : {
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique : true
    },
    Password : {
        type : String,
        required:true,
    },
    role : {
        type : String,
        required:true,
        default : "user",
        enum : ["admin","user"]
    }
},{timestamps : true})

export default mongoose.model("user",UserSchema);