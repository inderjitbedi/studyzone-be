const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const makeExpressCallback = require('./../providers/expressCallback')

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     User:
//  *       type: object
//  *       required:
//  *         - title
//  *         - author
//  *       properties:
//  *         id:
//  *           type: string
//  *           description: The auto-generated id of the book
//  *         email:
//  *           type: string
//  *           description: Email of the user
//  *         firstName:
//  *           type: string
//  *           description: First Name of the user
//  *         lastName:
//  *           type: string
//  *           description: First Name of the user
//  *         isVerified:
//  *           type: boolean
//  *           description: First Name of the user
//  *       example:
//  *         id: d5fE_asz
//  *         email: test123@gmail.com
//  *         author: Alexander K. Dewdney
//  *         firstName: Suraj
//  *         lastName: Regmi
//  *         isVerified: true
//  */
// /**
//    * @swagger
//    * /api/auth/register:
//    *   post:
//    *     summary: Returns user and JWT access token
//    *     tags: [Auth]
//    *     requestBody:
//    *       content:
//    *         application/json:
//    *            schema:
//    *              type: object
//    *              properties:
//    *                email:
//    *                  description: email for register
//    *                password:
//    *                  description: password for register
//    *     responses:
//    *       200:
//    *         description: Register api
//    *         content:
//    *           application/json:
//    *             schema:
//    *               type: array
//    *               items:
//    *                 $ref: '#/components/schemas/User'
//    *
//    */
router.post('/login', authController.login);
router.post('/register', authController.register);
router.put('/complete-signup/:inviteToken', authController.registerUser)

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);


function handleResponse(data) {
    console.log("=======", data);
    return data
}
module.exports = router;
