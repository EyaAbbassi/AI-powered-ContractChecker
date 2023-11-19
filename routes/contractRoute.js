const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');
const upload = require('../middlewares/uploadMiddleware');

/**
 * @swagger
 * tags:
 *   name: Contracts
 *   description: Operations related to contracts
 */

/**
 * @swagger
 * /contracts/upload-contract:
 *   post:
 *     summary: Upload a contract
 *     tags: [Contracts]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Contract uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Contract uploaded successfully
 *               contract:
 *                 contractId: 12345
 *                 title: Sample Contract
 *                 pagesNum: 10
 *                 author: John Doe
 *       500:
 *         description: Internal Server Error
 */
router.post('/upload-contract', upload.single('file'), contractController.uploadContract);


/**
 * @swagger
 * /contracts/analyze-contract:
 *   post:
 *     summary: Analyze a contract
 *     tags: [Contracts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contractId:
 *                 type: string
 *               analysisTypes:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Analysis complete
 *         content:
 *           application/json:
 *             example:
 *               message: Analysis complete
 *               result:
 *                 - type: Toxicity Analysis
 *                   result: Some result
 *                 - type: Legal Compliance
 *                   result: true
 *                 - type: Rule Based Legal Compliance
 *                   result: Some result
 *       404:
 *         description: Contract not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/analyze-contract', contractController.analyzeContract);

/**
 * @swagger
 * /contracts/all-contracts:
 *   get:
 *     summary: Get all contracts
 *     tags: [Contracts]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             example:
 *               contracts: [...]
 *               count: 10
 *       500:
 *         description: Internal Server Error
 */
router.get('/all-contracts', contractController.getAllContracts);

/**
 * @swagger
 * /contracts/get-contract/{id}:
 *   get:
 *     summary: Get contract by ID
 *     tags: [Contracts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the contract
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             example:
 *               _id: 12345
 *               title: Sample Contract
 *               pagesNum: 10
 *               author: John Doe
 *       404:
 *         description: Contract not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/get-contract/:id', contractController.getContractById);

/**
 * @swagger
 * /contracts/delete-contract/{id}:
 *   delete:
 *     summary: Delete contract by ID
 *     tags: [Contracts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the contract
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contract deleted successfully
 *       404:
 *         description: Contract not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/delete-contract/:id', contractController.deleteContractById);

module.exports = router;
