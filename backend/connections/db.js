import mongoose from "mongoose";


export const DBConnection = async () => {
    try{
        const connection = await mongoose.connect('mongodb+srv://pratice:pratice@cluster0.cc7lsvl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        console.log('MongoDB Connected');
    }
    catch(err){
        console.error('MongoDB connection error:', err);
    }
}