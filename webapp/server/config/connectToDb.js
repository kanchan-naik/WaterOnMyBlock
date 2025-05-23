// import dependencies
const mongoose = require("mongoose");
require('dotenv').config(); // Make sure dotenv is loaded

async function connectToDb() 
{
    console.log('Connecting to MongoDB using URL:', process.env.DB_URL); // Log the connection string (be careful to not expose sensitive info in production)
    try
    {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to db")
    } catch (err)
    {
        console.error("Error connecting to MongoDB:", err);
    }
    
}

module.exports = connectToDb;