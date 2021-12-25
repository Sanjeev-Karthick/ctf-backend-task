const express = require("express");
const router = express.Router();

const {signup, verifyRegisteration , login , logout } = require("../controllers/userController");

router.route('/signup').post(signup)
router.route('/verify').get(verifyRegisteration)
router.route('/login').post(login)
router.route('/logout').get(logout)
//router.route('/password/reset/:token').post(resetPassword)

module.exports = router