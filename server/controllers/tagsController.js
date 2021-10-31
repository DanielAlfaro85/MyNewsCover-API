/**
 * Model connector
 */
 const Tags = require("../models/tagsModel");

 /**
  * Creates a News Source
  *
  * @param {*} req Data required
  * @param {*} res Http status code 
  */
 const tagsPost = (req, res) => {
   var tags = new Tags();

   tags.name = req.body.name;
   tags.userID = req.body.userID;
 
   if (tags.name && tags.userID) {
     tags.save(function (err) {
       if (err) {
         res.status(422);
         console.log('error while saving the tags', err)
         res.json({
           error: 'There was an error saving the tags'
         });
       }
       res.status(201);//CREATED
       res.header({
         'location': `http://localhost:3000/api/Tags/?id=${tags.id}`
       });
       res.json(tags);
     });
   } else {
     res.status(422);
     console.log('error while saving the tags')
     res.json({
       error: 'No valid data provided for tags'
     });
   }
 };
 
 /**
  * Gets all News Source
  *
  * @param {*} req Data required
  * @param {*} res Http status code 
  */
 const tagsGet = (req, res) => {
   // If a specific news tags is required
   if (req.query && req.query.id) {
     Tags.find({ 'user_id': req.query.id }, function (err, tags) {
       if (err) {
         res.status(404);
         console.log('error while queryting the tags', err)
         res.json({ error: "User doesnt exist" })
       }
       res.json(tags);
     }).sort({ _id: -1 }).limit(10);
   } else {
     // Gets all news tags
     Tags.find(function (err, tags) {
       if (err) {
         res.status(422);
         res.json({ "error": err });
       }
       res.json(tags);
     });
 
   }
 };
 
 /**
  * Deletes a News Source
  *
  * @param {*} req Data required
  * @param {*} res Http status code 
  */
 const tagsDelete = (req, res) => {
   // If an specific task is required
   if (req.query && req.query.id) {
     Tags.find({"user_id" : req.query.user_id}, function (err, tags) {
       if (err) {
         res.status(500);
         console.log('error while queryting the tags', err)
         res.json({ error: "tags doesnt exist" })
       }
       // If the news source exists
       if(tags) {
         tags.remove(function(err){
           if(err) {
             res.status(500).json({message: "There was an error deleting the tags"});
           }
           res.status(204).json({});
         })
       } else {
         res.status(404);
         console.log('error while queryting the tags', err)
         res.json({ error: "tags doesnt exist" })
       }
     });
   } else {
     res.status(404).json({ error: "You must provide a tags ID" });
   }
 };
 
 /**
  * Updates a News Source
  *
  * @param {*} req Data required
  * @param {*} res Http status code 
  */
 const tagsPatch = (req, res) => {
   // get task by id
   if (req.query && req.query.id) {
     Tags.findById(req.query.id, function (err, tags) {
       if (err) {
         res.status(404);
         console.log('error while queryting the tags', err)
         res.json({ error: "tags doesnt exist" })
       }
       
       // Updates the news source (patch)
       tags.name = req.body.name ? req.body.name : tags.name;
       // Updates the news source object (put)
       // task.title = req.body.title
       // task.detail = req.body.detail
 
       tags.save(function (err) {
         if (err) {
           res.status(422);
           console.log('error while saving the tags', err)
           res.json({
             error: 'There was an error saving the tags'
           });
         }
         res.status(200); // OK
         res.json(tags);
       });
     });
   } else {
     res.status(404);
     res.json({ error: "tags doesnt exist" })
   }
 };
 
 /**
  * Exports
  */
 module.exports = {
   tagsGet,
   tagsPost,
   tagsPatch,
   tagsDelete
 }