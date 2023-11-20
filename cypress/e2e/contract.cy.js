describe('Contract test suite', () => {
  it('should upload a contract and return contract details', () => {
    cy.fixture('samplecontract.pdf').then((fileContent) => {
      cy.request({
        method: 'POST',
        url: '/contracts/upload-contract',
        body: { file: fileContent },
      }).then((response) => {
        const { status, body } = response;
        const { contract } = body;

        expect(status).to.equal(201);
        expect(body.message).to.equal('Contract uploaded successfully');
        expect(contract).to.have.all.keys('contractId', 'title', 'pagesNum', 'author');
      });
    });
  });

  it('Analyzes a contract', () => {
    const requestBody = {
      contractId: '12345',
      analysisTypes: ['Toxicity Analysis', 'Legal Compliance', 'Rule Based Legal Compliance'],
    };

    cy.request('POST', `/contracts/analyze-contract`, requestBody).then((response) => {
      const { status, body } = response;

      expect(status).to.equal(200);
      expect(body.message).to.equal('Analysis complete');
      expect(body.result).to.be.an('array');
    });
  });

  it('should fetch all contracts successfully', () => {
    cy.request({
      method: 'GET',
      url: '/contracts/all-contracts',
    }).then((response) => {
      const { status, body } = response;

      expect(status).to.equal(200);
      expect(body.contracts).to.be.an('array');
      expect(body.count).to.be.a('number');
    });
  });

  it('should fetch a specific contract successfully', () => {
    const contractId = '1234567890abcdef'; // Change with an existing object id from your database
    cy.request({
      method: 'GET',
      url: `/contracts/get-contract/${contractId}`,
    });
  });

  it('should delete a contract successfully', () => {
    // Change with an existing object id from your database
    const contractIdToDelete = '1234567890abcdef';

    cy.request('DELETE', `/contracts/delete-contract/${contractIdToDelete}`).then((response) => {
      const { status, body } = response;

      expect(status).to.equal(200);
      expect(body.message).to.equal('Contract deleted successfully');
    });
  });
});
