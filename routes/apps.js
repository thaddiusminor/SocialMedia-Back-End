const { App, validate } = require('../../models/app'); 
const express = require('express'); 
const router = express.Router(); 
 
// All endpoints and route handlers go here 

router.post('/', async (req, res) => { 
    try { 
        const { error } = validate(req.body);
        if (error)
        return res.status(400).send(error);
   
      // Need to validate body before continuing 
       
      const app = new App({ 
        name: req.body.name, 
        description: req.body.description, 
        category: req.body.category,  
      }); 
   
      await app.save(); 
   
      return res.send(app); 
    } catch (ex) { 
      return res.status(500).send(`Internal Server Error: ${ex}`); 
    } 
  });
 
module.exports = router;