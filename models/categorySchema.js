const { Schema, model } = require("mongoose")
const Joi = require("joi")

const categorySchema = new Schema({
    categoryName: {
        type: String,
        required: true
    },
    categoryImg: {
        type: String,
        required: true
    }
})

const Category = model("category", categorySchema)

const validateCategory = (body) => {
    const schema = Joi.object({
        categoryName: Joi.string().required(),
        categoryImg: Joi.string().required()
    })
    return schema.validate(body)
}

module.exports = { Category, validateCategory }