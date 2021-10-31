/**
 * Model connector
 */
const User = require("../models/registerModel");
const codeModels = require("../models/codeModel");

const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const THE_SECRET_KEY = '123';
//require("dotenv").config();
const accountSid = "AC814d9dd5d2a02813b1a22b5a2fe5322f";
const authToken = "71a3545755d348237436493b97358af2";
const client = require("twilio")(accountSid, authToken);

const url = 'http://localhost:3000/api/Code';
const fetch = require("node-fetch");

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

/**
 * Creates an user
 *
 * @param {*} req Data required
 * @param {*} res Http status code
 */
const userPost = (req, res) => {
  var user = new User();

  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;

  user.email = req.body.email;
  user.password = req.body.password;

  user.address = req.body.address;
  user.address2 = req.body.address2;

  user.country = req.body.country;
  user.city = req.body.city;

  user.postalCode = req.body.postalCode;
  user.phoneNumber = req.body.phoneNumber;
  user.role = req.body.role;
  user.enable = false

  if (user.firstName && user.lastName && user.email && user.password && user.role) {
    user.save(function (err) {
      if (err) {
        res.status(422);
        console.log('error while saving the user', err)
        res.json({
          error: 'There was an error saving the user'
        });
      }
      res.status(201); //CREATED
      sendMail(user);
      res.header({
        'location': `http://localhost:3000/api/users/?id=${user.id}`
      });
      res.json(user);
    });
  } else {
    res.status(422);
    console.log('error while saving the user')
    res.json({
      error: 'No valid data provided for user'
    });
  }
};

const sendMail = async (user) => {

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "geberthalfaro85@gmail.com", // generated ethereal user
      pass: "fpfbgqtqdxbtggod", // generated ethereal password
    },
  })

  var mailOptions = {
    from: '"Remitente', // sender address
    to: user.email, // list of receivers
    subject: "[My News Cover] Please confirm your email address", // Subject line
    text: `Hey ${user.firstName} ${user.lastName}!
    
    Thanks for joining My News Cover. To finish registration, please click the 
    link below to verify your account.
    https://localhost/apps/MyNewsCover-App/client/activateAccount.html?id=${user.id}`

  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      console.log("Email Sent");
      res.status(200).jsonp(req.body);
    }
  });
}
//http://localhost:3000/api/sessions?id=${user.id}&enable=true

const sessionGet = (req, res) => {
  console.log("working")
  if (req.query && req.query.id) {
    User.findById(req.query.id, function (err, user) {
      if (err) {
        res.status(404);
        console.log('error while queryting the user', err)
        res.json({ error: "User doesnt exist" })
      }

      // Updates the task object (patch)

      user.enable = true;
      //user.email = "dasd@gmail.com"
      //user.role = "admin";
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
}

const userAuth = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.find({ "email": email, "password": password });

  if (!user) {
    return res.json({ message: "the email doesnt exist" });
  }
  console.log(user)
  //const passwordValidate = await User.findOne({ password: password });
  jwt.sign({ user }, THE_SECRET_KEY, { expiresIn: 1440 }, (err, token) => {
    res.json({
      token
    });
  });
}

const sendMailLogin = (req, res) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "geberthalfaro85@gmail.com", // generated ethereal user
      pass: "fpfbgqtqdxbtggod", // generated ethereal password
    },
  })

  var mailOptions = {
    from: '"Remitente', // sender address
    to: req.body.email, // list of receivers
    subject: "[My News Cover] Login without password", // Subject line
    text: `
    This link is for you to log in without having to enter your password.

    https://localhost/apps/MyNewsCover-App/client/fastLogin.html?email=${req.body.email}`

  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      console.log("Email Sent");
      res.status(200).jsonp(req.body);
    }
  });
}

const userGetbyEmail = (req, res) => {
  // If a specific user is required
  if (req.query && req.query.email) {
    User.find({ "email": req.query.email }, function (err, user) {
      if (err) {
        res.status(404);
        console.log('error while queryting the user', err)
        res.json({ error: "User doesnt exist" })
      }
      res.json(user);
    });
  } else {
    //Gets all users
    User.findById(req.query.id, function (err, user) {
      if (err) {
        res.status(422);
        res.json({ "error": err });
      }
      res.json(user);
    });

  }
};

/**
 * Gets all users
 *
 * @param {*} req Data required
 * @param {*} res Http status code 
 */
const userGet = (req, res) => {
  // If a specific user is required
  if (req.query && req.query.email && req.query.password) {
    User.find({ "email": req.query.email, "password": req.query.password }, function (err, user) {
      if (err) {
        res.status(404);
        console.log('error while queryting the user', err)
        res.json({ error: "User doesnt exist" })
      }
      res.json(user);
    });
  } else {
    //Gets all users
    User.findById(req.query.id, function (err, user) {
      if (err) {
        res.status(422);
        res.json({ "error": err });
      }
      res.json(user);
    });

  }
};

const codePost = async (codigo, user_id) => {
  var data = {
    "code": codigo,
    "user_id": user_id
  }
  var code = new codeModels(data);
  await code.save();

};

const sendMessage = (req) => {
  const codigo = Math.round(Math.random()*1000)+1 + Math.round(Math.random()*1000)+1;
  console.log(codigo);
  codePost(codigo, req.body.user_id);
  client.messages.create({
    //to: process.env.MY_PHONE_NUMBER,
    to: `+506${req.body.phoneNumber}`,
    from: "+14136422084",
    body: `This is your login code ${codigo}`
  })
    .then(message => console.log(message.sid));
};
/**
 * Deletes one user
 *
 * @param {*} req Data required
 * @param {*} res Http status code 
 */
const userDelete = (req, res) => {
  // If a specific user is required
  if (req.query && req.query.id) {
    User.findById(req.query.id, function (err, user) {
      if (err) {
        res.status(500);
        console.log('error while queryting the user', err)
        res.json({ error: "User doesnt exist" })
      }
      // If the user exists
      if (user) {
        user.remove(function (err) {
          if (err) {
            res.status(500).json({ message: "There was an error deleting the user" });
          }
          res.status(204).json({});
        })
      } else {
        res.status(404);
        console.log('error while queryting the user', err)
        res.json({ error: "User doesnt exist" })
      }
    });
  } else {
    res.status(404).json({ error: "You must provide a User ID" });
  }
};

/**
 * Updates a user
 *
 * @param {*} req Data required
 * @param {*} res Http status code 
 */
const userPatch = (req, res) => {
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
  userGet,
  userPost,
  userPatch,
  userDelete,
  sessionGet,
  userAuth,
  sendMailLogin,
  userGetbyEmail,
  sendMessage
}
