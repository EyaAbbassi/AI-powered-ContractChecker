// routes/contract.js
const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');
const upload = require('../middlewares/uploadMiddleware');

router.post('/upload-contract', upload.single('file'), contractController.uploadContract);
router.get('/all-contracts', contractController.getAllContracts);
router.get('/get-contract/:id', contractController.getContractById);
router.delete('/delete-contract/:id', contractController.deleteContractById);
router.post('/analyze-contract', contractController.analyzeContract)

module.exports = router;
