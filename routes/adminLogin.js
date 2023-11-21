const route = require("express").Router()
const jwt = require("jsonwebtoken")
const { config } = require("dotenv")
config()

route.post("/login", async(req, res) => {
   try {
      const { login, password } = req.body
      if(login === "oliver" && password === "oliver"){
         const token = jwt.sign({login}, process.env.JWT_PRIVATE)
         return res.status(200).json({state: true, msg: "Succesfully Logged In", innerData: { login, token }})
      } else {  
         return res.status(400).json({state: false, msg: "Login Or Password Is Incorrect", innerData: []})
      }
   } 
   catch {
      res.status(500).json({state: true, msg: "Server Error", innerData: null})
   }
})

module.exports = route