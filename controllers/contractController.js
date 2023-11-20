const Contract = require('../models/contractModel');
const analysisService = require('../services/analysisService');
const pdfParse = require('pdf-parse');

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
