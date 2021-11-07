const { Post, validate } = require('../models/post'); 
const express = require('express'); 
const router = express.Router(); 
 
// All endpoints and route handlers go here 

router.post('/', async (req, res) => { 
    try { 
        const { error } = validate(req.body);
        if (error)
        return res.status(400).send(error);
   
      // Need to validate body before continuing 
       
      const post = new Post({ 
        username: req.body.name, 
        description: req.body.description, 
        category: req.body.category,  
      }); 
   
      await post.save(); 
   
      return res.send(post); 
    } catch (ex) { 
      return res.status(500).send(`Internal Server Error: ${ex}`); 
    } 
  });
 
module.exports = router;