export enum UserType {
  OWNER = 'OWNER',
  TENANT = 'TENANT'
}

export const OPTIONAL_COVERS = {
  JEWELLERY: 'Jewellery & Valuables',
  PAINTINGS: 'Paintings & Curios',
  EMERGENCY: 'Emergency Purchase',
  ALT_ACCOMM: 'Alternative Accommodation'
} as const;

export type OptionalCoverageId = keyof typeof OPTIONAL_COVERS;

export interface QuoteRequest {
  userType: UserType;
  buildingValue: number;
  contentsValue: number;
  selectedOptions: OptionalCoverageId[];
  startDate: string;
  durationYears: number;
  domesticWorkersCount: number;
  optionalCoverageValues: Partial<Record<OptionalCoverageId, number>>;
}

export interface SchemeDetails {
  buildingRent: number;
  furniture: number;
  clothing: number;
  appliances: number;
  tvAudio: number;
  acElectronics: number;
  kitchen: number;
  carpets: number;
  publicLiability: number;
  domesticStaff: number;
  paOwner: number;
  burglary: number;
  excess: number;
}

export interface QuoteResult {
  schemeName: string;
  netPremium: number;
  vat: number;
  totalPremium: number;
  breakdown: {
    basePremium: number;
    optionsCount: number;
    optionsCost: number;
    durationMultiplier: number;
    domesticWorkerSurcharge: number;
  };
  limits: {
    building: number;
    contents: number;
  };
  details: SchemeDetails;
  referenceId: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface Policy {
  id: string;
  policyNumber: string;
  userId: string;
  request: QuoteRequest;
  quoteResult: QuoteResult;
  premium: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING_RENEWAL';
  purchaseDate: string;
}

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  nationalId: string;
  dob: string;
  // Detailed Address
  streetAddress: string;
  streetNumber: string;
  floor: string;
  apartment: string;
  postalCode: string;
  neighborhood: string;
  city: string;
  nationalAddress?: string; // Kept for backward compatibility if needed
}

export interface FormalQuoteRequest {
  id: string;
  customer: CustomerDetails;
  quoteRequest: QuoteRequest;
  quoteResult: QuoteResult;
  status: 'PENDING' | 'CONTACTED' | 'CLOSED';
  submittedAt: string;
  contactedAt?: string;
}

// --- API INFRASTRUCTURE TYPES ---

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    timestamp: string;
    traceId: string;
  };
}

export interface SubmitQuotePayload {
  customer: CustomerDetails;
  quoteRequest: QuoteRequest;
  quoteResult: QuoteResult;
}


export interface ApiKey {
  id: string;
  partner_name: string;
  api_key: string;
  allowed_domains: string[];
  status: 'ACTIVE' | 'REVOKED';
  created_at: string;
  created_by?: string;
}