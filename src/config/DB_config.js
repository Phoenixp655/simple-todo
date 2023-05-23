const mongoose = require('mongoose');
require('dotenv').config();
const asyncHandle = require('express-async-handler');

mongoose.set('strictQuery',true);

const connectDB = asyncHandle(async () => {
    const connec = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`database connect ${connec.connection.host}`)
})

module.exports = connectDB