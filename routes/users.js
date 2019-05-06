var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
 res.send('respond with a resource');
});

// http://localhost:3000/users/add
// Save a new person
router.post('/add', function(req, res, next) {
 var firstName = req.body.firstName;
 var lastName = req.body.lastName;
 var phone = req.body.phone;
 console.warn('add', firstName, lastName, phone);
 var persons = require('../public/data/persons.json');

 persons.push({
   firstName,
   lastName,
   phone
 });

 var str = JSON.stringify(persons, null, 2);
 fs.writeFileSync('./public/data/persons.json', str);// se sterge in fiser ce a fost si se salveaza noile date


 res.json({
   success: true,
   message: 'TODO'
 });
});

module.exports = router;