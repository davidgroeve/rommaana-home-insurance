import { Policy, QuoteRequest, QuoteResult, User } from '../types';

const POLICIES_KEY = 'etihad_policies';

export const policyService = {
  getPolicies: async (userId: string): Promise<Policy[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const allPolicies = JSON.parse(localStorage.getItem(POLICIES_KEY) || '[]');
    return allPolicies.filter((p: Policy) => p.userId === userId);
  },

  createPolicy: async (user: User, request: QuoteRequest, result: QuoteResult): Promise<Policy> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(startDate.getFullYear() + 1);

    const newPolicy: Policy = {
      id: Date.now().toString(),
      policyNumber: `P-SA-${Math.floor(Math.random() * 10000000)}`,
      userId: user.id,
      request: request,
      quoteResult: result,
      premium: result.totalPremium,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: 'ACTIVE',
      purchaseDate: new Date().toISOString()
    };

    const allPolicies = JSON.parse(localStorage.getItem(POLICIES_KEY) || '[]');
    allPolicies.push(newPolicy);
    localStorage.setItem(POLICIES_KEY, JSON.stringify(allPolicies));

    return newPolicy;
  },
  
  renewPolicy: async (policyId: string): Promise<void> => {
      // Mock renewal logic
       await new Promise(resolve => setTimeout(resolve, 800));
       const allPolicies = JSON.parse(localStorage.getItem(POLICIES_KEY) || '[]');
       const updatedPolicies = allPolicies.map((p: Policy) => {
           if(p.id === policyId) {
                const newEndDate = new Date(p.endDate);
                newEndDate.setFullYear(newEndDate.getFullYear() + 1);
                return {
                    ...p,
                    endDate: newEndDate.toISOString(),
                    status: 'ACTIVE'
                }
           }
           return p;
       });
       localStorage.setItem(POLICIES_KEY, JSON.stringify(updatedPolicies));
  }
};