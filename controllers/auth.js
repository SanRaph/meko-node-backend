const crypto = require('crypto');
const CustomerAuthModel = require('../models/CustomerAuthModel');
const TechnicianAuthModel = require('../models/TechnicianAuthModel');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');

exports.registerCustomer = async (req, res, next) => {

    const { username, email, password } = req.body;

    try {

       const customer = new CustomerAuthModel( { username, email, password } );
       const registeredCustomer =  await customer.save();

        /* const customer = await Customerauth.create({ username, email, password }); */

        sendCustomerToken( customer, 201, res );

        res.status(200).json({ success: true, message: 'Customer registered' });

    } catch (error) {
        
        next(error);

    }
};


exports.registerTechnician = async (req, res, next) => { 
    
    const { username, email, password } = req.body;

    try {

        const technician = new TechnicianAuthModel( { username, email, password } );
        const registeredTechnician = await technician.save();


        sendTechnicianToken( technician, 201, res );

        res.status(200).json({ success: true, message: 'Technician registered' });
        
    } catch (error) {
        
        next(error);
        
    }
};




exports.loginCustomer = async (req, res, next) => {
    const { email, password } = req.body;


    if( !email || !password ) {
        return next( new ErrorResponse('Please provide an email and password', 400) );
    }

    try {
        const customer = await CustomerAuthModel.findOne({ email }).select('+password');
        
        if( !customer ) {
            return next( new ErrorResponse( 'User not found', 404 ) );
        }

        const isMatch = customer.matchPasswords(password);

        if( !isMatch ) {
            return next( new ErrorResponse( 'Unmatched password', 404 ) );
        }


        sendCustomerToken( customer, 201, res );

    } catch (error) {
        next(error);
        res.status(500).json({ success: false, error: error.message });
    }
};


exports.loginTechnician = async (req, res, next) => {
    const { email, password } = req.body;

    if( !email || !password ) {
        res.status(404).json({ success: false, error: 'Invalid incredentials' });
    }

    try {
        const technician = await TechnicianAuthModel.findOne({ email }).select('+password');

        if( !technician ) {
            res.status(404).json({ success: false, error: 'Invalid credentials' });
        }

        const isMatch = technician.matchPasswords(password);

        if( !isMatch ) {
            res.status(404).json({ success: false, error: 'Invalid credentials' });
        }


        sendTechnicianToken( technician, 200, res );

    } catch (error) {
        next(error);
        res.status(500).json({ success: false, error: error.message });
    }
};




exports.forgotpasswordcustomer = async (req, res, next) => {
    const { email } = req.body;


    try {
        const customer = await CustomerAuthModel.findOne({ email });

        console.log(customer);

        if( !customer ) {
           return next( new ErrorResponse( 'Email could not be sent', 404 ) );
        }

        const resetToken = customer.getResetCustomerPasswordToken();

        await customer.save();

        const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

        const message = `
         <h1> You Requested A Password Reset</h1>

         <p> Please go to this link to reset your password </p>

         <a href=${resetUrl} clicktracking=off > ${ resetUrl } </a>
        `;


        try {
            await sendEmail({ to: customer.email, subject: 'Password Reset Request', text: message });

            res.status(200).json({ success: true, data: 'Email sent' });


        } catch (error) {
            customer.resetCustomerPasswordToken = undefined;

            customer.resetPasswordExpire = undefined;

            await customer.save();

            return next( new ErrorResponse( 'Email could not be sent 2', 500 ) );

        }

    } catch (error) {

        next( error );
        
    }
};

//READ ALL CUSTOMERS
exports.getallcustomers = async ( req, res, next ) => {
    try {
         const customers = await CustomerAuthModel.find();
         res.status(200).json(customers);
    } catch (error) {
        next(error);
    }
};

//####################################
exports.getcustomer = async ( req, res, next ) => {
    const { id } = req.params;
    const customer = await CustomerAuthModel.findById({ _id: id })
    if( !customer ) return next( new ErrorResponse( 'No customer with this id', 404 ) );

    return res.json( customer );
};




exports.forgotpasswordtechnician = async ( req, res, next ) => {
    const { email } = req.body;

    try {
        const technician = await TechnicianAuthModel.findOne({ email });

        if( !technician ) {
            return next( new ErrorResponse( 'Email could not be sent', 404 ) );
        }

        const resetToken = technician.getResetTechnicianPasswordToken();
        
        await technician.save();

        const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

        const message = `
         <h1> You Requested A Password Reset</h1>

         <p> Please go to this link to reset your password </p>

         <a href=${resetUrl} clicktracking=off > ${ resetUrl } </a>
        `;

        try {
            await sendEmail({ to: technician.email, subject: 'Password Reset Request', text: message });

            res.status(200).json({ success: true, data: 'Email sent' });
            
        } catch (error) {

            technician.resetTechnicianPasswordToken = undefined;

            technician.resetPasswordExpire = undefined;

            await technician.save();

            return next( new ErrorResponse( 'Email could not be sent 2', 500 ) );

            
        }



    } catch (error) {
        next( error );
    }
};



exports.resetpasswordcustomer = async (req, res, next) => {

    const resetCustomerPasswordToken = crypto.createHash('256').update(req.params.resetToken).digest('hex');



    try {
        const customer = await CustomerAuthModel.findOne({ resetCustomerPasswordToken, resetPasswordExpire: { $gt: Date.now() } });

        if( !customer ){
            return next( new ErrorResponse( 'Invalid reset Token', 400 ) );
        }

        customer.password = req.body.password;

        customer.resetCustomerPasswordToken = undefined;
        customer.resetPasswordExpire = undefined;

        await customer.save();

        res.status(201).json({ success: true, data: 'Password reset success' });

    } catch (error) {
         next(error);
    }
};


exports.resetpasswordtechnician = async (req, res, next) => {
    const resetTechnicianPasswordToken = crypto.createHash('256').update(req.params.resetToken).digest('hex');

    try {
        const technician = await TechnicianAuthModel.findOne({ resetCustomerPasswordToken, resetPasswordExpire: { $gt: Date.now() } });

        if( !technician ) {
            return next( new ErrorResponse( 'Invalid reset Token' ) );
        }

        technician.password = req.body.password;

        technician.resetTechnicianPasswordToken = undefined;
        technician.resetPasswordExpire = undefined;

        await technician.save();

        res.status(201).json({ success: true, data: 'Password reset success' });
    } catch (error) {
        next(error);
    }
};








const sendCustomerToken = async (customer, statusCode, res) => {
    const token = await customer.getSignedToken();

    res.status(statusCode).json({ success: true, token });
};


const sendTechnicianToken = async ( technician, statusCode, res ) => {
    const token = await technician.getSignedToken();

    res.status(statusCode).json({ success: true, token });
};
