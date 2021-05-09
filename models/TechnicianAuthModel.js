const crpto = require('crypto');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const technicianAuthSchema = new Schema({
username: { type: String, required: [ true, 'Please provide username' ] },

email: { type: String, required: [ true, 'Please provide email' ], unique: true,  match: [ /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, ]},

password: { type: String, required: [true, 'Please provide email'], minlength: 6, select: false },

resetTechnicianPasswordToken: { type: String },

resetPasswordExpire: Date,

});


technicianAuthSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }

    const salt = bcrypt.genSalt(30);
    this.password = bcrypt.hash(this.password, salt);

} );


technicianAuthSchema.methods.matchPasswords = async function(password) {
    return await bcrypt.compare( password, this.password );
};

technicianAuthSchema.methods.getSignedToken = async function() {
    return jwt.sign( { id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE, } );

};

technicianAuthSchema.methods.getResetTechnicianPasswordToken = async function() {
    const resetTechnicianToken = crypto.randomBytes(20).toString('hex');

    this.resetTechnicianPasswordToken = crypto.createHash('sha256').update(resetTechnicianToken).digest('hex');

    this.resetPasswordExpire = Date.now() + 10 * ( 60 * 1000 );

    return resetTechnicianToken;
};


const TechnicianAuthModel = mongoose.model('TechnicianAuth', technicianAuthSchema);

module.exports = TechnicianAuthModel;
