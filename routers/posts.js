//raggruppo tutte le rotte che iniziano con /posts in un file e lo uso in 
// app.js tramite la classe express.Router()

// richiamo istanza di framework Express
const express = require('express')

// creiamo un istanza dell'oggetto rotte di Express
const router = express.Router();

//import del controller
const blogController = require('./../controllers/blogController')


// rotta GET 
router.get('/',blogController.index);

//inizio crud 

//SHOW
router.get('/:id', blogController.show);

// CREATE ( STORE)
router.post('/',blogController.store);

// UPDATE totale
router.put('/:id', blogController.update);

// MODIFY totale
router.patch('/:id', blogController.modify);

// DELETE
router.delete('/:id', blogController.destroy);

// esporta l'istanza di queste rotte
module.exports = router;