/**
 * Model connector
 */
const Category = require("../models/categoryModel");

/**
 * Creates a category
 *
 * @param {*} req Data required
 * @param {*} res Http status code
 */
const categoryPost = (req, res) => {
  var category = new Category();

  category.nameCategory = req.body.nameCategory;

  if (category.nameCategory) {
    category.save(function (err) {
      if (err) {
        res.status(422);
        console.log('error while saving the category', err)
        res.json({
          error: 'There was an error saving the category'
        });
      }
      res.status(201);//CREATED
      res.header({
        'location': `http://localhost:3000/api/categories/?id=${category.id}`
      });
      res.json(category);
    });
  } else {
    res.status(422);
    console.log('error while saving the category')
    res.json({
      error: 'No valid data provided for category'
    });
  }
};

/**
 * Gets all categories
 *
 * @param {*} req Data required
 * @param {*} res Http status code
 */
const categoryGet = (req, res) => {
  // If a specific category is required
  if (req.query && req.query.id) {
    Category.findById(req.query.id, function (err, category) {
      if (err) {
        res.status(404);
        console.log('error while queryting the category', err)
        res.json({ error: "category doesnt exist" })
      }
      res.json(category);
    });
  } else {
    // Gets all categories
    Category.find(function (err, category) {
      if (err) {
        res.status(422);
        res.json({ "error": err });
      }
      res.json(category);
    });

  }
};

/**
 * Deletes one category
 *
 * @param {*} req Data required
 * @param {*} res Http status code
 */
const categoryDelete = (req, res) => {
  // If a specific category is required
  if (req.query && req.query.id) {
    Category.findById(req.query.id, function (err, category) {
      if (err) {
        res.status(500);
        console.log('error while queryting the category', err)
        res.json({ error: "category doesnt exist" })
      }
      // If the category exists
      if (category) {
        category.remove(function (err) {
          if (err) {
            res.status(500).json({ message: "There was an error deleting the category" });
          }
          res.status(204).json({});
        })
      } else {
        res.status(404);
        console.log('error while queryting the category', err)
        res.json({ error: "category doesnt exist" })
      }
    });
  } else {
    res.status(404).json({ error: "You must provide a category ID" });
  }
};

/**
 * Updates a category
 *
 * @param {*} req Data required
 * @param {*} res Http status code
 */
const categoryPatch = (req, res) => {
  // Gets a category by id
  if (req.query && req.query.id) {
    Category.findById(req.query.id, function (err, category) {
      if (err) {
        res.status(404);
        console.log('error while queryting the category', err)
        res.json({ error: "category doesnt exist" })
      }

      // Updates the category object (patch)
      category.nameCategory = req.body.nameCategory ? req.body.nameCategory : task.nameCategory;

      // Update the category object (put)
      // task.title = req.body.title
      // task.detail = req.body.detail

      category.save(function (err) {
        if (err) {
          res.status(422);
          console.log('error while saving the category', err)
          res.json({
            error: 'There was an error saving the category'
          });
        }
        res.status(200); // OK
        res.json(category);
      });
    });
  } else {
    res.status(404);
    res.json({ error: "category doesnt exist" })
  }
};

/**
 * Exports
 */
module.exports = {
  categoryGet,
  categoryPost,
  categoryPatch,
  categoryDelete
}