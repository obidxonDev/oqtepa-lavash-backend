const jwt = require("jsonwebtoken")
const { config } = require("dotenv")
config()

const auth = (req, res, next) => {
   const token = req.header("token")
   if(!token){
      return res.status(400).json({state: false, msg: "Token Not Found", innerData: null})
   }
   jwt.verify(token, process.env.JWT_PRIVATE, (err, decoded) => {
      if(err){
         return res.status(400).json({state: false, msg: "Token Is Incorrect", innerData: null})
      }
      req.user = decoded
      next()
   })
}

module.exports = { auth }