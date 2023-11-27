describe('Contract test suite', () => {
  
  it('Analyzes Rule Based Legal Compliance of the contract', () => {
    const requestBody = {
      contractId: '65651b73a5eeea8ebaf3839d',
      analysisTypes: ['Rule Based Legal Compliance'],
    };

    cy.request('POST', `/contracts/analyze-contract`, requestBody).then((response) => {
      const { status, body } = response;

      expect(status).to.equal(200);
      expect(body.message).to.equal('Analysis complete');
      expect(body.result).to.be.an('array');
    });
  });

  it('Analyzes the Legal Compliance of the contract', () => {
    const requestBody = {
      contractId: '65651b73a5eeea8ebaf3839d',
      analysisTypes: ['Legal Compliance'],
    };
  
    cy.request('POST', `/contracts/analyze-contract`, requestBody).then((response) => {
      const { status, body } = response;
  
      expect(status).to.equal(200);
      expect(body.message).to.equal('Analysis complete');
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
    const contractId = '65651b73a5eeea8ebaf3839d';
    cy.request({
      method: 'GET',
      url: `/contracts/get-contract/${contractId}`,
    }).then((response) => {
      const { status, body } = response;

      expect(status).to.equal(200);
      expect(body).to.be.an('object')
    });
  });

  it('should delete a contract successfully', () => {
    const contractIdToDelete = '65651b73a5eeea8ebaf3839d';

    cy.request('DELETE', `/contracts/delete-contract/${contractIdToDelete}`).then((response) => {
      const { status, body } = response;

      expect(status).to.equal(200);
      expect(body.message).to.equal('Contract deleted successfully');
    });
  });
});
