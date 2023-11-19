const mongoose = require('mongoose');


const complianceRuleSchema = new mongoose.Schema({
    rule: String,
    isCompliant: Boolean,
    message: String,
  });

const contractSchema = new mongoose.Schema({
    title: String,
    pagesNum: Number,
    author: String,
    creator: String,
    contentText: String,
    toxicityAnalysis: String,
    isCompliant: String,
    ruleBasedLegalCompliance: [complianceRuleSchema],
    detailedReport: String

});

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
