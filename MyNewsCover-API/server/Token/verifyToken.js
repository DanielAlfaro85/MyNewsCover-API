const jwt = require("jsonwebtoken");

app.post("/api/posts", verifyToken, (req , res) => {

    jwt.verify(req.token, 'secretkey', (error, authData) => {
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
  const verifyToken = (req, res, next) => {
     const bearerHeader =  req.headers['authorization'];
        console.log(bearerHeader)
     if(typeof bearerHeader !== 'undefined'){
          const bearerToken = bearerHeader.split(" ")[1];
          req.token  = bearerToken;
          next();
     }else{
         res.sendStatus(403);
     }
  }

  
module.exports = verifyToken;
