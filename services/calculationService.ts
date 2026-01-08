import { QuoteRequest, QuoteResult, UserType } from '../types';
import { SCHEMES, PRICING_RULES } from '../constants';

/**
 * Calculates premium based on Schemes A, B, C, D logic.
 */
export const calculatePremium = async (request: QuoteRequest): Promise<QuoteResult> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  // 1. Find the appropriate Scheme
  const suitableScheme = SCHEMES.find(scheme => {
    const buildingFits = request.userType === UserType.TENANT || scheme.limits.building >= request.buildingValue;
    const contentsFits = scheme.limits.contents >= request.contentsValue;
    return buildingFits && contentsFits;
  });

  if (!suitableScheme) {
    throw new Error("Values exceed maximum coverage limits (Scheme D). Please contact support.");
  }

  // 2. Base Premium
  const basePremium = suitableScheme.premiums[request.userType];

  // 3. Optional Coverages (Each adds 20% of the Base Premium)
  const numberOfOptions = request.selectedOptions.length;
  const surchargePerOption = basePremium * PRICING_RULES.OPTION_SURCHARGE_PERCENT;
  const totalOptionsCost = surchargePerOption * numberOfOptions;

  // 4. Domestic Worker Surcharge (If more than 1)
  // "Domestic Worker, normally we will have only 1 but we must provide the option to have more"
  const domesticWorkerSurcharge = request.domesticWorkersCount > 1
    ? (request.domesticWorkersCount - 1) * 50 // SAR 50 per additional worker
    : 0;

  // 5. Multi-year Multiplier
  const durationMultiplier = request.durationYears || 1;

  // 6. Net Premium
  const netPremium = (basePremium + totalOptionsCost + domesticWorkerSurcharge) * durationMultiplier;

  // 7. VAT
  const vat = netPremium * PRICING_RULES.VAT_RATE;
  const totalPremium = netPremium + vat;

  return {
    schemeName: suitableScheme.name,
    netPremium: Number(netPremium.toFixed(2)),
    vat: Number(vat.toFixed(2)),
    totalPremium: Number(totalPremium.toFixed(2)),
    breakdown: {
      basePremium: basePremium,
      optionsCount: numberOfOptions,
      optionsCost: totalOptionsCost,
      durationMultiplier: durationMultiplier,
      domesticWorkerSurcharge: domesticWorkerSurcharge
    },
    limits: suitableScheme.limits,
    details: suitableScheme.details,
    referenceId: `SA-${Math.floor(Math.random() * 1000000)}`
  };
};