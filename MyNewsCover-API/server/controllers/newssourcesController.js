/**
 * Model connector
 */
const NewsSources = require("../models/newssourcesModel");

/**
 * Creates a News Source
 *
 * @param {*} req Data required
 * @param {*} res Http status code 
 */
const newsSourcePost = (req, res) => {
  var sources = new NewsSources();

  sources.url = req.body.url;
  sources.nameSource = req.body.nameSource;

  sources.categoryID = req.body.categoryID;
  sources.userID = req.body.userID;

  if (sources.url && sources.nameSource) {
    sources.save(function (err) {
      if (err) {
        res.status(422);
        console.log('error while saving the sources', err)
        res.json({
          error: 'There was an error saving the sources'
        });
      }
      res.status(201);//CREATED
      res.header({
        'location': `http://localhost:3000/api/newsSources/?id=${sources.id}`
      });
      res.json(sources);
    });
  } else {
    res.status(422);
    console.log('error while saving the sources')
    res.json({
      error: 'No valid data provided for sources'
    });
  }
};

/**
 * Gets all News Source
 *
 * @param {*} req Data required
 * @param {*} res Http status code 
 */
const newsSourceGet = (req, res) => {
  // If a specific news sources is required
  if (req.query && req.query.id) {
    NewsSources.findById(req.query.id, function (err, sources) {
      if (err) {
        res.status(404);
        console.log('error while queryting the sources', err)
        res.json({ error: "User doesnt exist" })
      }
      res.json(sources);
    });
  } else {
    // Gets all news sources
    NewsSources.find(function (err, sources) {
      if (err) {
        res.status(422);
        res.json({ "error": err });
      }
      res.json(sources);
    });

  }
};

/**
 * Deletes a News Source
 *
 * @param {*} req Data required
 * @param {*} res Http status code 
 */
const newsSourceDelete = (req, res) => {
  // If an specific task is required
  if (req.query && req.query.id) {
    NewsSources.findById(req.query.id, function (err, sources) {
      if (err) {
        res.status(500);
        console.log('error while queryting the sources', err)
        res.json({ error: "sources doesnt exist" })
      }
      // If the news source exists
      if(sources) {
        sources.remove(function(err){
          if(err) {
            res.status(500).json({message: "There was an error deleting the sources"});
          }
          res.status(204).json({});
        })
      } else {
        res.status(404);
        console.log('error while queryting the sources', err)
        res.json({ error: "sources doesnt exist" })
      }
    });
  } else {
    res.status(404).json({ error: "You must provide a sources ID" });
  }
};

/**
 * Updates a News Source
 *
 * @param {*} req Data required
 * @param {*} res Http status code 
 */
const newsSourcePatch = (req, res) => {
  // get task by id
  if (req.query && req.query.id) {
    NewsSources.findById(req.query.id, function (err, sources) {
      if (err) {
        res.status(404);
        console.log('error while queryting the sources', err)
        res.json({ error: "sources doesnt exist" })
      }
      
      // Updates the news source (patch)
      sources.url = req.body.url ? req.body.url : sources.url;
      sources.nameSource = req.body.nameSource ? req.body.nameSource : sources.nameSource;
    
      sources.categoryID = req.body.categoryID ? req.body.categoryID : sources.categoryID;
      sources.userID = req.body.userID ? req.body.userID : sources.userID;
    
      // Updates the news source object (put)
      // task.title = req.body.title
      // task.detail = req.body.detail

      sources.save(function (err) {
        if (err) {
          res.status(422);
          console.log('error while saving the sources', err)
          res.json({
            error: 'There was an error saving the sources'
          });
        }
        res.status(200); // OK
        res.json(sources);
      });
    });
  } else {
    res.status(404);
    res.json({ error: "sources doesnt exist" })
  }
};

/**
 * Exports
 */
module.exports = {
  newsSourceGet,
  newsSourcePost,
  newsSourcePatch,
  newsSourceDelete
}