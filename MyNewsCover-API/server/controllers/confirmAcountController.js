/**
 * Model connector
 */
 const User = require("../models/registerModel");


 /**
 * Updates a user
 *
 * @param {*} req Data required
 * @param {*} res Http status code 
 */
const confirmPatch = (req, res) => {
    // Gets a task by id
    if (req.query && req.query.id) {
      User.findById(req.query.id, function (err, user) {
        if (err) {
          res.status(404);
          console.log('error while queryting the user', err)
          res.json({ error: "User doesnt exist" })
        }
  
        // Updates the task object (patch)
      
        user.enable = req.body.enable ? req.body.enable : user.enable;
        // Updates the task object (put)
        // task.title = req.body.title
        // task.detail = req.body.detail
  
        user.save(function (err) {
          if (err) {
            res.status(422);
            console.log('error while saving the user', err)
            res.json({
              error: 'There was an error saving the user'
            });
          }
          res.status(200); // OK
          res.json(user);
        });
      });
    } else {
      res.status(404);
      res.json({ error: "User doesnt exist" })
    }
  };

  /**
 * Exports
 */
module.exports = {
    confirmPatch
  }