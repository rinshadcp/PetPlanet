const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin/adminController');

router.get('/',controller.adminHome);
router.get('/viewUser',controller.viewUser) ;
router.get('/animalPage',controller.animalPage)
router.get('/agePage',controller.agePage)

router.post('/addAnimal',controller.addAnimal)
router.post('/deleteAnimal/:id',controller.deleteAnimal)
router.post('/addAge',controller.addAge)
router.post('/deleteAge/:id',controller.deleteAge)



module.exports= router;