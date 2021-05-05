const crypto = require('crypto');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const customerAuthSchema = new Schema({
username: { type: String, required: [ true, 'Please provide a username' ] },

email: { type: String, required: [true, 'Please provide email'], unique: true, match: [ /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/   , 'Please provide a valid email']},

password: { type: String, required: [ true, 'Please provide password' ], minlength: 6, select: false },

resetCustomerPasswordToken: { type: String },

resetPasswordExpire: Date

});

customerAuthSchema.pre('save', async function(next) { 
    if(!this.isModified('password')){
        next();
    }

    const salt = bcrypt.genSalt(30);

    this.password = bcrypt.hash(this.password, salt);

    next();

 });


 customerAuthSchema.methods.matchPasswords = async function(password) {
     return await bcrypt.compare(password, this.password);
 };

 customerAuthSchema.methods.getSignedToken = async function() {
     return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE, });
 };


 customerAuthSchema.methods.getResetCustomerPasswordToken = async function() {
     const resetCustomerToken = crypto.randomBytes(20).toString('hex');

     this.resetCustomerPasswordToken = crypto.createHash('sha256').update(resetCustomerToken).digest('hex');

     this.resetPasswordExpire = Date.now() + 10 * ( 60 * 1000 );

     return resetCustomerToken;
 };



const customerAuth = mongoose.model('CustomerAuth', customerAuthSchema);

module.exports = customerAuth;