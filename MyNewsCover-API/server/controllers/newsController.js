/**
 * Model connector
 */
const News = require("../models/newsModel");
const Tags = require("../models/tagsModel");

const newsSourceController = require('../Controllers/newssourcesController');

const url = 'http://localhost:3000/api/newsSources';
const fetch = require("node-fetch");

let Parser = require('rss-parser');

var DomParser = require('dom-parser');

const getNewssources = (req) => {
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      for (let item of data) {
        readRSS(item)
      }
    });
}


const readRSS = async (newsSource) => {
  let saved = [];
  let parser = new Parser();
  let feed = await parser.parseURL(newsSource.url);
  feed.items.forEach(item => {
    newsPost(newsSource, item)
    if (item.categories) {
      item.categories.forEach(tag => {
        if (tag != "deportes") {
          if (feed.items.length > 0) {
            saved.push(tag);
          }
        }
      });
    }
  });
  let unique = [...new Set(saved)];
  unique.forEach(element => {
    tagsPost(newsSource, element)
  });
}

const tagsPost = async (newsSource, tag) => {
  var data = {
    "name": tag,
    "user_id": newsSource.userID
  }
  var tags = new Tags(data);
  await tags.save();
};

const newsPost = async (newsSource, item) => {
  console.log(item.categories)
  var data = {
    "title": item.title,
    "short_description": item.content,
    "permanlink": item.link,
    "date": item.pubDate,
    "news_source_id": newsSource._id,
    "user_id": newsSource.userID,
    "category_id": newsSource.categoryID,
    "tags": item.categories
  }
  var news = new News(data);
  await news.save();

};

/**
 * Gets all news
 *
 * @param {*} req Data required
 * @param {*} res Http status code
 */
const newsGet = (req, res) => {

  if (req.query && req.query.id) {
    News.findById(req.query.id, function (err, news) {
      if (err) {
        res.status(404);
        console.log('error while queryting the news', err)
        res.json({ error: "news doesnt exist" })
      }
      res.json(news);
    });
  } else {
    // Gets all news
    News.find(function (err, news) {
      if (err) {
        res.status(422);
        res.json({ "error": err });
      }
      res.json(news);
    });

  }
};

/**
 * Deletes a new
 *
 * @param {*} req Data required
 * @param {*} res Http status code
 */
const newsDelete = (req, res) => {

  if (req.query && req.query.id) {
    News.findById(req.query.id, function (err, news) {
      if (err) {
        res.status(500);
        console.log('error while queryting the news', err)
        res.json({ error: "news doesnt exist" })
      }

      if (news) {
        news.remove(function (err) {
          if (err) {
            res.status(500).json({ message: "There was an error deleting the news" });
          }
          res.status(204).json({});
        })
      } else {
        res.status(404);
        console.log('error while queryting the news', err)
        res.json({ error: "news doesnt exist" })
      }
    });
  } else {
    res.status(404).json({ error: "You must provide a news ID" });
  }
};

/**
 * Exports
 */
module.exports = {
  readRSS,
  getNewssources,
  newsGet,
  newsPost,
  newsDelete
}