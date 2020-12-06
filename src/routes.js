import express from 'express'
import * as help from './helpFns.js'
//unique id generator from uuid
import { v4 as uuidv4 } from 'uuid'
const router = express.Router()
const entries =[]
const message = {
    message: "validation error", 
    invalid: []
}
// Bad Request response function
const badRequest = (input, res) => {
    res.status(400).json(input)
}
const objProps = ["name", "email", "phoneNumber", "content"]
const objKeys = (req) => Object.keys(req.body)
const errors = (request) => objProps.filter((properties) => !objKeys(request).includes(properties))

//general request body validation and
//phone number validation: the only format accepted is 10 digits
//
const validateItem = (req, res, next) => {
    message.invalid = []
    if (objKeys(req).length < 4) {
        errors(req).forEach(element => message.invalid.push(element))
        return badRequest(message, res)
    }
    next()
}
// strings validation for name, only latin letters accepted
const validateString = (req, res, next) => {
    const letters = /^[A-Za-z]+$/;
    if(!req.body.name.match(letters) || !req.body.name.value == 0){
        message.invalid.push("name")
    }
    next()

}
// //email validation middleware, generic 
const validateEmail = (req, res, next) => {
    const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if(!req.body.email.match(mailformat)){
        message.invalid.push("email")
    }
    next()
}
//phone number validation: the only format accepted is 10 digits
const validatePhone = (req, res, next) => {
    const phoneno = /^\d{10}$/;
    if(!req.body.phoneNumber.match(phoneno)){
        message.invalid.push("phoneNumber")
    }
    next()
}
//middleware for Bad Request object return based on lenght of object's array entries
const returnMessage =(req, res, next) => {
    if (message.invalid.length > 0){
        return badRequest(message, res)
    }
    next()
}
//Route to create an entry when the user submits their contact form:
router.post('/contact_form/entries', validateItem, validateString, validateEmail, validatePhone, returnMessage, (req, res) => {
        //unique id generator
        req.body.id = uuidv4()
        entries.push(req.body)
        return res.status(201).json(req.body)
})

//Route to create a user:
router.post('/users', /*validateItem,*/ (req, res) => {
    

    //items.push(req.body)
    return res.status(201).send(req.body)
})

//Route to log a registered user in to create a JWT (JSON Web Token) token:
router.post('/auth', validateItem, (req, res) => {
    

    items.push(req.body)
    return res.status(201).send(req.body)
})

//Route to get a listing of all submissions when given a valid JWT is provided
//as part of the :
//Authorization: bearer token
router.get('/contact_form/entries', (req, res) => {
    return res.send(items)
})

//Route to get a specific submission when given an ID alongside a valid JWT:
//Authorization: bearer token
router.get('/contact_form/entries/:id', (req, res) => {
    return res.send("items")
})

export default router