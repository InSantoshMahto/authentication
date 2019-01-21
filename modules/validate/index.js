'use strict'

// imports
const isEmail = require('isemail');

/*---------------------- validation class -------------*/
class validation {
    /*
     * constuctor
     * it will execute every time when instance is created
     */
    constructor() {
        console.log(`I am from validation module`);
    }

    /*
     * Email validation
     * It will accept eamil address and callbackes function
     */
    email(_email, callback) {
        let responce = (isEmail.validate(_email) === true) ? false : true;
        return callback(responce);
    }


}



/* creating a objects */
let validate = new validation();

module.exports = {
    email: validate.email
}