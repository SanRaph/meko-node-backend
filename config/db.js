const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect( 'mongodb://localhost:27017/mekodb', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true } );

    console.log('Customer Auth DB running..');
};

module.exports = connectDB;