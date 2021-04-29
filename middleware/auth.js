const jwt = require('jsonwebtoken');
const CustomerAuthModel = require('../models/CustomeraAuthModel');
const TechnicianAuthModel = require('../models/TechnicianAuthModel');
const ErrorResponse = require('../utils/errorResponse');


exports.protectCustomerRoute = async ( req, res, next ) => {

    let token;

    if( req.headers.authorization && req.headers.authorization.startsWith('Bearer') ) {
        token = req.headers.authorization.split(" ")[1];
        
    }

    if( !token ) {
        return next( new ErrorResponse( "Not authorized to access this route", 401 ) );

    }

    try {
        
        const decoded = jwt.verify( token, process.env.JWT_SECRET );

        const customer = await CustomerAuthModel.findById( decoded.id );


        if( !customer ) {
            return next( new ErrorResponse( 'No customer with this ID found!', 404 ) );
        }

        req.customer = customer;

        next();

    } catch (error) {
        
        return next( new ErrorResponse( 'Not authorized to access this route', 401 ) );
    }
};


exports.protectTechnicianRoute = async ( req, res, next ) => {

    let token;

    if( req.headers.authorization && req.headers.authorization.startsWith('Bearer') ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if( !token ) {
        return next( new ErrorResponse( 'Not authorized to access this route!', 401 ) );
    }

    try {
        const decoded = jwt.verify( token, process.env.JWT_SECRET );

        const technician = await TechnicianAuthModel.findById( decoded.id );


        if( !technician ) {
            return next( new ErrorResponse( 'No technician with this ID found!', 404 ));
        }

        req.technician = technician;

        next();

    } catch (error) {
       
        return next( new ErrorResponse( 'Not authorized to access this route', 401 ) );
    }
};


