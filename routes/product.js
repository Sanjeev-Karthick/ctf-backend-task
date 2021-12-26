const express = require("express");
const router = express.Router();

const {addProduct, deleteProduct , findProduct , listAllProducts, updateProductQuantity } = require("../controllers/productController");
const {isLoggedin} = require("../middlewares/user");
router.route('/add').post(isLoggedin,addProduct);
router.route('/update').put(isLoggedin,updateProductQuantity);
router.route('/delete').delete(isLoggedin,deleteProduct);

router.route('/all').get(isLoggedin,listAllProducts);
router.route('/search').get(isLoggedin,findProduct);

module.exports = router