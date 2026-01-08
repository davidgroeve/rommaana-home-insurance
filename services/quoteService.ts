import { FormalQuoteRequest, QuoteRequest, QuoteResult, CustomerDetails } from '../types';

const QUOTE_REQUESTS_KEY = 'rommaana_quote_requests';

export const quoteService = {
  submitQuoteRequest: async (customer: CustomerDetails, request: QuoteRequest, result: QuoteResult): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const newRequest: FormalQuoteRequest = {
      id: `REQ-${Date.now()}`,
      customer,
      quoteRequest: request,
      quoteResult: result,
      status: 'PENDING',
      submittedAt: new Date().toISOString()
    };

    const currentRequests = JSON.parse(localStorage.getItem(QUOTE_REQUESTS_KEY) || '[]');
    currentRequests.push(newRequest);
    localStorage.setItem(QUOTE_REQUESTS_KEY, JSON.stringify(currentRequests));
  },

  getAllRequests: async (): Promise<FormalQuoteRequest[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const requests = JSON.parse(localStorage.getItem(QUOTE_REQUESTS_KEY) || '[]');
    // Sort by newest first
    return requests.sort((a: FormalQuoteRequest, b: FormalQuoteRequest) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }
};