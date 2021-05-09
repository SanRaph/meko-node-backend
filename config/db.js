const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect( process.env.MONGO_URI || 'mongodb://localhost:27017/mekodb', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true } );

    console.log('Meko DB running..');
};

module.exports = connectDB;