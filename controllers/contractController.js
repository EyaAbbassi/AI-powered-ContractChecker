const Contract = require('../models/contractModel');
const analysisService = require('../services/analysisService');
const pdfParse = require('pdf-parse');

/**
 * @swagger
 * tags:
 *   name: Contracts
 *   description: Operations related to contracts
 */

/**
 * @swagger
 * /contracts/upload:
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
exports.uploadContract = async (req, res) => {
  try {
    const { buffer, originalname } = req.file;

    // Parse PDF using pdf-parse
    const pdfPromis = pdfParse(buffer);
    const [pdfInfo] = await Promise.all([pdfPromis]);

    const pagesNum = pdfInfo.numpages;
    const title = pdfInfo.info.Title;
    const author = pdfInfo.info.Author;
    const contentText = pdfInfo.text;

    const newContract = new Contract({ title, pagesNum, author, contentText });

    newContract.save();

    // Return extracted data to the client
    res.status(201).json({ 
        message: 'Contract uploaded successfully',
        contract: {
            contractId: newContract._id,
            title,
            pagesNum,
            author,
        },
    });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @swagger
 * /contracts/analyze:
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
exports.analyzeContract = async (req, res) => {
  try {
    const { contractId, analysisTypes } = req.body;

    const contract = await Contract.findById(contractId);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    const analysisResults = [];

    for (const type of analysisTypes) {
      let result;

      switch (type) {
        case 'Toxicity Analysis':
          toxicityCheck = await analysisService.analyzeToxicity(contract.contentText);
          result = toxicityCheck.toxicity;
          contract.toxicityAnalysis = result;
          break;
          
          case 'Legal Compliance':
            legalComplianceCheck = await analysisService.analyzeLegalCompliance(contract.contentText);
            result = legalComplianceCheck.isCompliant
            contract.isCompliant = result;
            break;
  
          case 'Rule Based Legal Compliance':
            result = await analysisService.ruleBasedLegalCompliance(contract.contentText);
            contract.ruleBasedLegalCompliance = result;
            break;        
  
        default:
          result = 'Not implemented';
          break;
      }
      analysisResults.push({ type, result });
    }

    // Save analysis results to the database
    await contract.save();

    res.status(200).json({ message: 'Analysis complete', result: analysisResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @swagger
 * /contracts:
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
exports.getAllContracts = async (req, res) => {
  try {
    const contracts = await Contract.find();
    const count = await Contract.countDocuments();

    res.status(200).json({ contracts, count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @swagger
 * /contracts/{id}:
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
exports.getContractById = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      res.status(404).json({ message: 'Contract not found' });
    } else {
      res.status(200).json(contract);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @swagger
 * /contracts/{id}:
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
exports.deleteContractById = async (req, res) => {
  try {
    const contract = await Contract.findByIdAndDelete(req.params.id);
    if (!contract) {
      res.status(404).json({ message: 'Contract not found' });
    } else {
      res.status(200).json({ message: 'Contract deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
