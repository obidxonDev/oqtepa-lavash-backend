const router = require("express").Router()
const { upload } = require("../middleware/imgUploader")
const path = require("path")
const { auth } = require("../middleware/auth")

const { Product } = require("../models/productSchema")
const { Category } = require("../models/categorySchema")
const { mongoose } = require("mongoose")

router.get("/", async (req, res) => {
   try {
      const products = await Product.find()
      res.status(200).json({ state: true, msg: "All Data Is There", innerData: products })
   }
   catch {
      res.status(500).json({ state: false, msg: "Server Error", innerData: null })
   }
})

router.get("/manage-products", auth, async (req, res) => {
   try {
      const { category } = req.query
      const products = await Product.find( category ? { 'cType.categoryName': category } : null )
      res.status(200).json({ state: false, msg: "All Data Is There", innerData: products })
   } 
   catch {
      res.status(500).json({ state: false, msg: "Server Error", innerData: null })
   }
})

router.get('/cTypeObjects', (req, res) => {
   Product.find({}, 'cType.categoryName')
       .then(products => {

         // const cTypeObjects = products.map(product => product.cType);
         // const uniqueCategories = [...new Set(cTypeObjects.map(product => product.cType.categoryName))];

         const uniqueCTypeObjects = Array.from(new Set(products.map(product => JSON.stringify(product.cType)))).map(json => JSON.parse(json));
         res.status(200).json({ state: true, msg: "All Categories", innerData: uniqueCTypeObjects });
       })
       .catch(error => {
           res.status(500).json({ error: 'An error occurred while fetching cType objects' });
       });
});

router.get('/search', (req, res) => {
   const { searchText } = req.query;

   Product.find({ title: { $regex: searchText, $options: 'i' } })
       .then(products => {
           res.status(200).json({ state: true, msg: "Data is Here", innerData: products });
       }) 
       .catch(error => {
           res.status(500).json({ error: 'An error occurred while searching for products' });
       });
});

router.get("/images/:filename", (req, res) => {
   const filename = req.params.filename;
   const imagePath = path.join(__dirname, "../images", filename);
   res.sendFile(imagePath);
});

router.get("/categories", async (req, res) => {
   try {
      const categories = await Category.find()
      res.status(200).json({ state: true, msg: "All Category Is There", innerData: categories })
   }
   catch {
      res.status(500).json({ state: false, msg: "Server Error", innerData: null })
   }
})

router.post("/", auth, upload.single("img"), async (req, res) => {
   const { title, price, type, desc } = req.body
   let cType = JSON.parse(type)
   let url = `${req.protocol}://${req.get("host")}/products/images/${req.file.filename}`
   let newProduct = await Product.create({ title, price, cType, desc, url })
   res.status(201).json({ state: true, msg: "Product Created", innerData: newProduct })

})

router.post("/categories", auth, upload.single("categoryImg"), async (req, res) => {
   try {
      let { categoryName } = req.body

      let validCategory = await Category.findOne({ categoryName: req.body.categoryName })
      if (validCategory) {
         return res.status(200).json({ state: false, msg: "This Category Is In List", innerData: null })
      }

      let categoryImg = `${req.protocol}://${req.get("host")}/products/images/${req.file.filename}`

      let newCategory = await Category.create({ categoryName, categoryImg })
      res.status(201).json({ state: false, msg: "Category Created", innerData: newCategory })
   }
   catch {
      res.status(500).json({ state: false, msg: "Server Error", innerData: null })
   }
})

router.delete("/categories/:id", auth, async (req, res) => {
   try {
      const { id } = req.params
      await Category.findByIdAndDelete(id)
      res.status(200).json({ state: true, msg: "Product Deleted", innerData: null })
   }
   catch {
      res.status(500).json({ state: false, msg: "Server Error", innerData: null })
   }
})


router.post("/delete-multiple", async (req, res) => {
   try {
      const { productIds } = req.body;
      const objIds = productIds.map(i => new mongoose.Types.ObjectId(i))
      if(productIds.length > 0){
         await Product.deleteMany({ _id: { $in: objIds } });
         res.status(200).json({ state: true, msg: "Products Deleted", innerData: null })
      } else{
         res.status(200).json({ state: false, msg: "No Products To Delete", innerData: null })
      }
   } 
   catch {
      res.status(500).json({ state: false, msg: "Server Errrror", innerData: null })
   }
})

router.delete("/:id", auth, async (req, res) => {
   try {
      const { id } = req.params
      await Product.findByIdAndDelete(id)
      res.status(200).json({ state: true, msg: "Product Deleted", innerData: null })
   }
   catch {
      res.status(500).json({ state: false, msg: "Server Errrror", innerData: null })
   }
})


router.post("/updateImg/:id", upload.single("newImg"), async (req, res) => {
   try {
      const { id } = req.params
      let newUrl = `${req.protocol}://${req.get("host")}/products/images/${req.file.filename}`
      
      await Product.findByIdAndUpdate(id, { url: newUrl })
      res.status(200).json({ state: true, msg: "Product Img Updated", innerData: newUrl })
   } 
   catch {
      res.status(500).json({ state: false, msg: "Server Error", innerData: null })
   }
})

router.put("/update/:id", async (req, res) => {
   try{
      const { id } = req.params
      const { title, desc, type, price } = req.body
      const cType = JSON.parse(type)
      const newProduct = await Product.findByIdAndUpdate(id, {title, desc, cType, price})
      res.status(200).json({ state: true, msg: "Product Updated", innerData: newProduct })
   }
   catch{
      res.status(500).json({ state: false, msg: "Server Error", innerData: null })
   }
})


module.exports = router