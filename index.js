const express = require("express")
const { connect } = require("mongoose")
const { config } = require("dotenv")
const cors = require("cors")
const Login = require("./routes/adminLogin")
const Products = require("./routes/products")
config()

const app = express()
app.use(express.json())
app.use(cors())

app.use("/admin", Login)
app.use("/products", Products)

connect(process.env.MONGODB_URL)
   .then(res => console.log("MongoDb Connected"))
   .catch(err => console.log("MongoDb Is Not Connected"))

app.get("/", (req, res) => {
   res.json("App is Running")
})

const PORT = process.env.PORT
app.listen(PORT, console.log(`Listening on Port ${PORT}`))