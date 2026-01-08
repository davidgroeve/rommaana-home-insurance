import {
  QuoteRequest,
  QuoteResult,
  FormalQuoteRequest,
  Policy,
  CustomerDetails,
  SubmitQuotePayload,
  ApiResponse,
  UserType,
  ApiKey
} from '../types';
import { SCHEMES, PRICING_RULES } from '../constants';
import { supabase } from './supabaseClient';

/**
 * ROMMAANA API CLIENT
 * This client interacts with Supabase for data storage and authentication.
 */
export const rommaanaApi = {

  // --- 1. PRICING ENGINE ---

  pricing: {
    /**
     * Calculate the premium based on user input.
     * Calculation is performed locally for speed.
     */
    calculate: async (request: QuoteRequest): Promise<QuoteResult> => {
      // Simulate small delay for UI feel
      await new Promise(resolve => setTimeout(resolve, 600));

      const suitableScheme = SCHEMES.find(scheme => {
        const buildingFits = request.userType === UserType.TENANT || scheme.limits.building >= request.buildingValue;
        const contentsFits = scheme.limits.contents >= request.contentsValue;
        return buildingFits && contentsFits;
      });

      if (!suitableScheme) {
        throw new Error("Values exceed maximum coverage limits (Scheme D). Please contact support.");
      }

      const basePremium = suitableScheme.premiums[request.userType];
      const numberOfOptions = request.selectedOptions.length;
      const surchargePerOption = basePremium * PRICING_RULES.OPTION_SURCHARGE_PERCENT;
      const totalOptionsCost = surchargePerOption * numberOfOptions;

      const domesticWorkerSurcharge = request.domesticWorkersCount > 1
        ? (request.domesticWorkersCount - 1) * 50
        : 0;

      const durationMultiplier = request.durationYears || 1;
      const netPremium = (basePremium + totalOptionsCost + domesticWorkerSurcharge) * durationMultiplier;

      const vat = netPremium * PRICING_RULES.VAT_RATE;
      const totalPremium = netPremium + vat;

      return {
        schemeName: suitableScheme.name,
        netPremium: Number(netPremium.toFixed(2)),
        vat: Number(vat.toFixed(2)),
        totalPremium: Number(totalPremium.toFixed(2)),
        breakdown: {
          basePremium,
          optionsCount: numberOfOptions,
          optionsCost: totalOptionsCost,
          durationMultiplier,
          domesticWorkerSurcharge
        },
        limits: suitableScheme.limits,
        details: suitableScheme.details,
        referenceId: `SA-${Math.floor(Math.random() * 1000000)}`
      };
    }
  },

  // --- 2. QUOTE REQUESTS ---

  quotes: {
    /**
     * Submit a formal quote request for policy issuance.
     */
    submit: async (payload: SubmitQuotePayload): Promise<void> => {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('quotes')
        .insert([{
          user_id: user?.id,
          customer_details: payload.customer,
          quote_request: payload.quoteRequest,
          quote_result: payload.quoteResult,
          status: 'PENDING'
        }]);

      if (error) throw error;
    },

    /**
     * Admin: Get all submitted requests.
     */
    getAll: async (): Promise<FormalQuoteRequest[]> => {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(q => ({
        id: q.id,
        customer: q.customer_details,
        quoteRequest: q.quote_request,
        quoteResult: q.quote_result,
        status: q.status,
        submittedAt: q.submitted_at
      }));
    },

    /**
     * Admin: Update the status of a quote request.
     */
    updateStatus: async (id: string, status: FormalQuoteRequest['status']): Promise<void> => {
      const { error } = await supabase
        .from('quotes')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    }
  },

  // --- 3. POLICIES ---

  policies: {
    /**
     * Get policies for a specific user.
     */
    list: async (userId: string): Promise<Policy[]> => {
      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      return (data || []).map(p => ({
        id: p.id,
        policyNumber: p.policy_number,
        userId: p.user_id,
        request: p.quote_request,
        quoteResult: p.quote_result,
        premium: p.premium_amount,
        startDate: p.start_date,
        endDate: p.end_date,
        status: p.status,
        purchaseDate: p.created_at
      }));
    },

    /**
     * Renew an existing policy.
     */
    renew: async (policyId: string): Promise<void> => {
      const { data: existing } = await supabase
        .from('policies')
        .select('end_date')
        .eq('id', policyId)
        .single();

      if (!existing) throw new Error('Policy not found');

      const newEndDate = new Date(existing.end_date);
      newEndDate.setFullYear(newEndDate.getFullYear() + 1);

      const { error } = await supabase
        .from('policies')
        .update({
          end_date: newEndDate.toISOString(),
          status: 'ACTIVE'
        })
        .eq('id', policyId);

      if (error) throw error;
    }
  },

  // --- 4. B2B MANAGEMENT ---

  b2b: {
    /**
     * Get all API keys for B2B partners.
     */
    getKeys: async (): Promise<ApiKey[]> => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    /**
     * Generate a new API key for a partner.
     */
    generateKey: async (partnerName: string): Promise<string> => {
      const { data: { user } } = await supabase.auth.getUser();
      // Generate a simple random key string
      const newKey = `rh_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

      const { error } = await supabase
        .from('api_keys')
        .insert([{
          partner_name: partnerName,
          api_key: newKey,
          status: 'ACTIVE',
          created_by: user?.id
        }]);

      if (error) throw error;
      return newKey;
    },

    /**
     * Revoke (deactivate) an API key.
     */
    revokeKey: async (keyId: string): Promise<void> => {
      const { error } = await supabase
        .from('api_keys')
        .update({ status: 'REVOKED' })
        .eq('id', keyId);

      if (error) throw error;
    }
  }
};
