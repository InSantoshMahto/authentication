'use strict'

// imports
const isEmail = require('isemail');

/*---------------------- validation class -------------*/
class validation {
    /**
     * constructor
     * it will execute every time when instance is created
     */
    constructor() {
        console.log(`I am from validation module`);
    }

    /**
     * Email validation
     * It will accept email address and callback function
     */
    email(_email, callbacks) {
        let response = (isEmail.validate(_email) === true) ? false : true;
        return callbacks(response);
    };

    /**
     * mobile validation
     * It will accept mobile number and callback function
     */

}

/* creating a objects */
let validate = new validation();

// exports
module.exports = {
    email: validate.email
}