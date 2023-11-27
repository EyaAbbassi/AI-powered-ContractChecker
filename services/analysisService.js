const toxicity = require('@tensorflow-models/toxicity');
const natural = require('natural');

// Tokenizer
const tokenizer = new natural.WordTokenizer();


// Function to analyze toxicity using TensorFlow
const analyzeToxicity = async (text) => {
  try {
    const toxicityModel = await toxicity.load();
    const toxicityAnalysis = await toxicityModel.classify([text]);

    const toxicityResult = toxicityAnalysis[0].results[0];
    return {
      toxicity: toxicityResult.match,
    };
  } catch (error) {
    console.error('Error analyzing toxicity:', error);
    throw error;
  }
};

const analyzeLegalCompliance = async (text) => {
  try {
    // Tokenize the text into words
    const words = tokenizer.tokenize(text);

    // Named Entity Recognition (NER)
    const nerResults = words.map((word) => {
      return { word, entity: natural.PorterStemmer.stem(word) }; // Using PorterStemmer for simplification
    });

    // Sentiment Analysis
    const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
    const sentimentScore = analyzer.getSentiment(tokenizer.tokenize(text));

    // Check for legal terms in NER results
    const legalTerms = ['law', 'contract', 'agreement', 'legal', 'compliance'];
    const isLegalTermFound = nerResults.some((result) => legalTerms.includes(result.entity.toLowerCase()));

    // You can define your own criteria for legal compliance based on the analysis results
    const isCompliant = isLegalTermFound && sentimentScore >= 0;

    return {
      isCompliant
    };
  } catch (error) {
    console.error(error);
    return {
      isCompliant: false,
    };
  }
};     

const ruleBasedLegalCompliance = async (text) => {
  // Define rules for legal compliance
  const complianceRules = [
    {
      keyword: 'TERM AND TERMINATION',
      required: true,
      message: 'Document must include a TERM AND TERMINATION terms.',
    },
    {
      keyword: 'CONFIDENTIALITY',
      required: true,
      message: 'Document must include CONFIDENTIALITY terms.',
    },
  ];

  // Check each rule
  const complianceResults = complianceRules.map((rule) => {
    const isKeywordPresent = text.toLowerCase().includes(rule.keyword.toLowerCase());

    return {
      rule: rule.keyword,
      isCompliant: rule.required ? isKeywordPresent : !isKeywordPresent,
      message: isKeywordPresent ? 'Rule Checked! All Good!' : rule.message,
    };
  });

  return complianceResults;
};

module.exports = {
    analyzeToxicity,
    analyzeLegalCompliance,
    ruleBasedLegalCompliance
  };