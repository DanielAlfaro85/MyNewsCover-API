/**
 * Express
 */
const express = require('express');
const app = express();

/**
 * Database connection
 */
const mongoose = require("mongoose");
const db = mongoose.connect("mongodb://127.0.0.1:27017/Ultimate-project");
const jwt = require("jsonwebtoken");

const THE_SECRET_KEY = '123';

/*require("dotenv").config();
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);*/

const bodyParser = require("body-parser");
app.use(bodyParser.json());

/*client.messages.create({
    to: process.env.MY_PHONE_NUMBER,
    from: "+14136422084",
    body: "This is your login code"
})
.then(message => console.log(message.sid));
/*app.post("/api/login", (req , res) => {
  const user = {
      id: 1,
      nombre : "Daniel",
      email: "geberthalfaro85@gmail.com"
  }

  jwt.sign({user}, 'secretkey', {expiresIn: '32s'}, (err, token) => {
      res.json({
          token
      });
  });

});*/

app.use("/api/posts", verifyToken, (req , res) => {
  console.log("hola yo soy el token",req.token)
  jwt.verify(req.token, THE_SECRET_KEY, (error, authData) => {
      if(error){
          res.sendStatus(403);
      }else{
          res.json({
                  mensaje: "Post fue creado",
                  authData
              });
      }
  });
});

// Authorization: Bearer <token>
function verifyToken(req, res, next){
   const bearerHeader =  req.headers['authorization'];

   if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(" ")[1];
        req.token  = bearerToken;
        next();
   }else{
       res.sendStatus(403);
   }
}


/**
 * User controller
 */
const {
  userPatch,
  userPost,
  userGet,
  userDelete,
  sessionGet,
  userAuth,
  sendMailLogin,
  userGetbyEmail,
  sendMessage
} = require("./controllers/registerController");

/**
 * Category controller
 */
const {
  categoryPatch,
  categoryPost,
  categoryGet,
  categoryDelete
} = require("./controllers/categoryController");

/**
 * News controller
 */
const {
  getNewssources,
  newsPost,
  newsGet,
  newsDelete
} = require("./controllers/newsController");

/**
 * News Sources controller
 */
const {
  newsSourcePatch,
  newsSourcePost,
  newsSourceGet,
  newsSourceDelete
} = require("./controllers/newssourcesController");

const {
  confirmPatch
} = require("./controllers/confirmAcountController");

const {
  tagsPatch,
  tagsPost,
  tagsGet,
  tagsDelete
} = require("./controllers/tagsController");

const {
  CodePatch,
  CodePost,
  CodeGet,
  CodeDelete
} = require("./controllers/codeController");



/**
 * Cors
 */
const cors = require("cors");
app.use(cors({
  domains: '*',
  methods: "*"
}));

/**
 * Users http methods
 */
app.get("/api/users", userGet);
app.post("/api/users", userPost);
app.patch("/api/users", userPatch);
app.put("/api/users", userPatch);
app.delete("/api/users", userDelete);
app.post("/api/userAuth", userAuth);
app.post("/api/sendMailLogin", sendMailLogin);
app.get("/api/userGetbyEmail", userGetbyEmail);
app.post("/api/sendMessage", sendMessage);

app.get("/api/sessions", sessionGet);

app.patch("/api/confirmAcount", confirmPatch);
app.put("/api/confirmAcount", confirmPatch);

/**
 * Categories http methods
 */
app.get("/api/categories", categoryGet);
app.post("/api/categories", categoryPost);
app.patch("/api/categories", categoryPatch);
app.put("/api/categories", categoryPatch);
app.delete("/api/categories", categoryDelete);

/**
 * News http methods
 */
app.get('/newss', getNewssources);
app.get("/api/news", newsGet);
app.post("/api/news", newsPost);
app.delete("/api/news", newsDelete);

/**
 * News Sources http methods
 */
app.get("/api/newsSources", newsSourceGet);
app.post("/api/newsSources", newsSourcePost);
app.patch("/api/newsSources", newsSourcePatch);
app.put("/api/newsSources", newsSourcePatch);
app.delete("/api/newsSources", newsSourceDelete);

app.get("/api/tags", tagsGet);
app.post("/api/tags", tagsPost);
app.patch("/api/tags", tagsPatch);
app.put("/api/tags", tagsPatch);
app.delete("/api/tags", tagsDelete);

app.get("/api/Code", CodeGet);
app.post("/api/Code", CodePost);
app.patch("/api/Code", CodePatch);
app.put("/api/Code", CodePatch);
app.delete("/api/Code", CodeDelete);

/**
 * Host
 */
app.listen(3000, () => console.log(`Project app listening on port 3000!`))