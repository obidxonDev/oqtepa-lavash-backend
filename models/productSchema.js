const { Schema, model } = require("mongoose")
const Joi = require("joi")

const productSchema = new Schema({
   title: {
      type: String,
      required: true
   },
   price: {
      type: Number,
      required: true
   },
   cType: {
      type: Object,
      required: true
   },
   desc: {
      type: String,
      required: true
   },
   url: {
      type: String,
      required: true
   },
})

const Product = model("product", productSchema)

const validateProduct = (body) => {
   const schema = Joi.object({
      title: Joi.string().required(),
      price: Joi.number().required(),
      cType: Joi.object().required(),
      desc: Joi.string().required(),
      url: Joi.string().required()
   })
   return schema.validate(body)
}

module.exports = { Product, validateProduct }