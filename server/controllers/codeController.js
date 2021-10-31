/**
 * Model connector
 */
 const Code = require("../models/codeModel");

 /**
  * Creates a News Source
  *
  * @param {*} req Data required
  * @param {*} res Http status code 
  */
 const CodePost = (req, res) => {
   var code = new Code();

   code.code = req.body.code;
   code.user_id = req.body.user_id;
 
   if (code.code && code.userID) {
     code.save(function (err) {
       if (err) {
         res.status(422);
         console.log('error while saving the Code', err)
         res.json({
           error: 'There was an error saving the Code'
         });
       }
       res.status(201);//CREATED
       res.header({
         'location': `http://localhost:3000/api/Code/?id=${code.id}`
       });
       res.json(code);
     });
   } else {
     res.status(422);
     console.log('error while saving the Code')
     res.json({
       error: 'No valid data provided for Code'
     });
   }
 };
 
 /**
  * Gets all News Source
  *
  * @param {*} req Data required
  * @param {*} res Http status code 
  */
 const CodeGet = (req, res) => {
   // If a specific news Code is required
   if (req.query && req.query.code) {
     Code.find({ 'code': req.query.code }, function (err, code) {
       if (err) {
         res.status(404);
         console.log('error while queryting the Code', err)
         res.json({ error: "User doesnt exist" })
       }
       res.json(code);
     });
   } else {
     // Gets all news Code
     Code.find(function (err, code) {
       if (err) {
         res.status(422);
         res.json({ "error": err });
       }
       res.json(code);
     });
 
   }
 };
 
 /**
  * Deletes a News Source
  *
  * @param {*} req Data required
  * @param {*} res Http status code 
  */
 const CodeDelete = (req, res) => {
   // If an specific task is required
   if (req.query && req.query.user_id) {
     Code.find({"user_id" : req.query.user_id}, function (err, code) {
       if (err) {
         res.status(500);
         console.log('error while queryting the Code', err)
         res.json({ error: "Code doesnt exist" })
       }
       // If the news source exists
       if(code) {
         Code.remove(function(err){
           if(err) {
             res.status(500).json({message: "There was an error deleting the Code"});
           }
           res.status(204).json({});
         })
       } else {
         res.status(404);
         console.log('error while queryting the Code', err)
         res.json({ error: "Code doesnt exist" })
       }
     });
   } else {
     res.status(404).json({ error: "You must provide a Code ID" });
   }
 };
 
 /**
  * Updates a News Source
  *
  * @param {*} req Data required
  * @param {*} res Http status code 
  */
 const CodePatch = (req, res) => {
   // get task by id
   if (req.query && req.query.code) {
     Code.find({"code" : req.query.code}, function (err, code) {
       if (err) {
         res.status(404);
         console.log('error while queryting the Code', err)
         res.json({ error: "Code doesnt exist" })
       }
       
       // Updates the news source (patch)
       code.code = req.body.code ? req.body.code : code.code;
       // Updates the news source object (put)
       // task.title = req.body.title
       // task.detail = req.body.detail
 
       code.save(function (err) {
         if (err) {
           res.status(422);
           console.log('error while saving the Code', err)
           res.json({
             error: 'There was an error saving the Code'
           });
         }
         res.status(200); // OK
         res.json(code);
       });
     });
   } else {
     res.status(404);
     res.json({ error: "Code doesnt exist" })
   }
 };
 
 /**
  * Exports
  */
 module.exports = {
   CodeGet,
   CodePost,
   CodePatch,
   CodeDelete
 }