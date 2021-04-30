
const customerAuthModel = require('../models/CustomeraAuthModel');
const TechnicianAuthModel = require('../models/TechnicianAuthModel');
const ErrorResponse = require('../utils/errorResponse');

exports.registerCustomer = async (req, res, next) => {

    const { username, email, password } = req.body;

    try {

       const customer = new CustomerAuthModel( { username, email, password } );
       const registeredCustomer =  await customer.save();

        /* const customer = await Customerauth.create({ username, email, password }); */

        sendCustomerToken( customer, 201, res );

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




exports.forgotpassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const customer = await customerAuthModel.findOne({ email });

        if( !customer ) {
           // return next( new ErrorResponse( 'Email could not be sent', 404 ) );
        }
    } catch (error) {
        
    }
};

exports.resetpassword = (req, res, next) => {
    res.send('Resetpassword route');
};









const sendCustomerToken = async (customer, statusCode, res) => {
    const token = await customer.getSignedToken();

    res.status(statusCode).json({ success: true, token });
};


const sendTechnicianToken = async ( technician, statusCode, res ) => {
    const token = await technician.getSignedToken();

    res.status(statusCode).json({ success: true, token });
};
