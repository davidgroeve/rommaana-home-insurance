// Simulating the "Backend" logic that would normally reside in the Google Sheet or Database.

export const APP_NAME = "Rommaana Home Insurance";

export const PRICING_RULES = {
  VAT_RATE: 0.05, // 5% VAT
  OPTION_SURCHARGE_PERCENT: 0.20, // 20% increase per option
};

export const SCHEMES = [
  {
    name: 'Scheme A',
    limits: {
      building: 500000,
      contents: 115000,
    },
    details: {
      buildingRent: 25000,
      furniture: 25000,
      clothing: 20000,
      appliances: 25000,
      tvAudio: 10000,
      acElectronics: 15000,
      kitchen: 10000,
      carpets: 10000,
      publicLiability: 1000000,
      domesticStaff: 25000,
      paOwner: 100000,
      burglary: 25000,
      excess: 1000,
    },
    premiums: {
      OWNER: 600,
      TENANT: 300,
    }
  },
  {
    name: 'Scheme B',
    limits: {
      building: 1000000,
      contents: 140000,
    },
    details: {
      buildingRent: 50000,
      furniture: 35000,
      clothing: 25000,
      appliances: 25000,
      tvAudio: 12500,
      acElectronics: 17500,
      kitchen: 12500,
      carpets: 12500,
      publicLiability: 1500000,
      domesticStaff: 25000,
      paOwner: 100000,
      burglary: 25000,
      excess: 1000,
    },
    premiums: {
      OWNER: 1200,
      TENANT: 600,
    }
  },
  {
    name: 'Scheme C',
    limits: {
      building: 2500000,
      contents: 235000,
    },
    details: {
      buildingRent: 100000,
      furniture: 75000,
      clothing: 40000,
      appliances: 35000,
      tvAudio: 17500,
      acElectronics: 22500,
      kitchen: 20000,
      carpets: 25000,
      publicLiability: 2500000,
      domesticStaff: 35000,
      paOwner: 150000,
      burglary: 25000,
      excess: 1000,
    },
    premiums: {
      OWNER: 2000,
      TENANT: 1000,
    }
  },
  {
    name: 'Scheme D',
    limits: {
      building: 4000000,
      contents: 365000,
    },
    details: {
      buildingRent: 200000,
      furniture: 100000,
      clothing: 75000,
      appliances: 75000,
      tvAudio: 25000,
      acElectronics: 30000,
      kitchen: 25000,
      carpets: 35000,
      publicLiability: 3750000,
      domesticStaff: 35000,
      paOwner: 200000,
      burglary: 25000,
      excess: 1000,
    },
    premiums: {
      OWNER: 3500,
      TENANT: 1750,
    }
  }
];

export const DETAILED_COVERAGES = [
  { id: 'fire', categoryId: 'fireExplosion', category: 'Fire & Explosion', event: 'Fire', description: 'Damage to your house and household goods caused by fire.' },
  { id: 'explosion', categoryId: 'fireExplosion', category: 'Fire & Explosion', event: 'Explosion or Implosion', description: 'Destruction or damage caused due to explosion or implosion.' },
  { id: 'lightning', categoryId: 'naturalPeril', category: 'Natural Peril', event: 'Lightning', description: 'Damage or destruction caused to the property due to lightning.' },
  { id: 'earthquake', categoryId: 'naturalPeril', category: 'Natural Peril', event: 'Earthquake', description: 'Property damage in the event of an earthquake.' },
  { id: 'volcanic', categoryId: 'naturalPeril', category: 'Natural Peril', event: 'Volcanic Eruption, or other Convulsions of Nature', description: 'Property damage in the event of a Volcanic Eruption, or other Convulsions of Nature.' },
  { id: 'storm', categoryId: 'naturalPeril', category: 'Natural Peril', event: 'Storm, Cyclone, Typhoon, Tempest, Hurricane, Tornado, Tsunami, Flood and Inundation', description: 'Loss, destruction or damage directly caused by specified weather events.' },
  { id: 'subsidence', categoryId: 'earthMovement', category: 'Earth Movement', event: 'Subsidence of the land on which Your Home Building stands, Landslide, Rockslide', description: 'Loss, destruction or damage directly caused by subsidence, landslide, or rockslide.' },
  { id: 'bushFire', categoryId: 'fire', category: 'Fire', event: 'Bush fire', description: 'Loss, destruction or damage caused by Bush fire.' },
  { id: 'forestFire', categoryId: 'fire', category: 'Fire', event: 'Forest fire/Jungle fire', description: 'Loss, destruction or damage caused by Forest fire/Jungle fire.' },
  { id: 'impact', categoryId: 'externalDamage', category: 'External Damage', event: 'Impact damage of any kind', description: 'Visible physical damage or destruction due to impact by any rail/road vehicle or animal by direct contact.' },
  { id: 'missile', categoryId: 'manMadePeril', category: 'Man-Made Peril', event: 'Missile Testing Operations', description: 'Loss, destruction or damage caused by Missile Testing Operations.' },
  { id: 'riot', categoryId: 'manMadePeril', category: 'Man-Made Peril', event: 'Riot, Strikes, Malicious Damages', description: 'Loss or damage caused by vandals, malicious persons, protests, strikes, labor unrest, riots or civil commotion.' },
  { id: 'waterBurst', categoryId: 'waterDamage', category: 'Water Damage', event: 'Bursting and/or Overflowing of Water Tanks, Apparatus & Pipes', description: 'Damage caused by bursting or overflowing of water tanks at the insured address.' },
  { id: 'sprinkler', categoryId: 'waterDamage', category: 'Water Damage', event: 'Leakage from automatic sprinkler installations', description: 'Loss or damage caused due to leakage from automatic sprinklers.' },
  { id: 'theft7Days', categoryId: 'conditionalTheft', category: 'Conditional Theft', event: 'Theft within 7 days from the occurrence of and proximately caused by any of the above Insured Events', description: 'Protects home contents against theft occurred within 7 days of and proximately caused by an insured event (e.g., after a storm damages the roof).' },
  { id: 'lossOfRent', categoryId: 'additionalExpense', category: 'Additional Expense', event: 'Loss of Rent', description: 'Coverage if the insured\'s home is destroyed or damaged and cannot be rented out.' },
  { id: 'altAccom', categoryId: 'additionalExpense', category: 'Additional Expense', event: 'Rent for Alternative Accommodation', description: 'Coverage for alternate accommodation if the insured\'s home is destroyed or damaged.' },
  { id: 'debrisRemoval', categoryId: 'additionalExpense', category: 'Additional Expense', event: 'Cost of Removal of Debris up to 2% of claim amount', description: 'Reimbursement of expenses incurred towards removal of debris from insured premises.' },
  { id: 'profFees', categoryId: 'additionalExpense', category: 'Additional Expense', event: 'Architect’s, Surveyor’s, Consulting Engineering fees up to 5% of claim amount', description: 'Reimbursement of expenses incurred towards Architects and Engineers Consulting fees.' },
  { id: 'autoIncrement', categoryId: 'policyBenefit', category: 'Policy Benefit', event: 'Auto increment in sum insured', description: 'Automatic 10% annual increase in sum insured for policies longer than one year, without additional premium.' },
  { id: 'contentDamage', categoryId: 'contentCoverage', category: 'Content Coverage', event: 'Content/Household items (Non-portables only)', description: 'Damage to non-portable household items (furniture, TV, AC, electrical appliances) by any of the mentioned insured events.' },
  { id: 'publicLiability', categoryId: 'liability', category: 'Liability', event: 'Public Liability', description: 'Coverage for liability to the public.' },
  { id: 'personalAccident', categoryId: 'personalAccident', category: 'Personal Accident', event: 'PA (Death, PTD, PPD)', description: 'Personal Accident coverage for Death, Permanent Total Disability, and Permanent Partial Disability.' },
  { id: 'servantLiability', categoryId: 'liability', category: 'Liability', event: 'Liability towards domestic servants', description: 'Coverage for liability regarding domestic servants.' },
];

export const EXCLUSIONS = [
  { id: 'stdExclusions', item: 'All standard property exclusions', description: 'General industry exclusions not explicitly listed (e.g., wear and tear).' },
  { id: 'excess', item: 'Excess', description: 'The deductible amount the policyholder must pay before the insurer covers the loss.' },
  { id: 'war', item: 'War and warlike perils', description: 'Damage or loss resulting from acts of war.' },
  { id: 'terrorism', item: 'Terrorism', description: 'Damage or loss resulting from acts of terrorism.' },
  { id: 'nuclear', item: 'Nuclear weapons and hazardous chemicals', description: 'Damage or loss from nuclear or chemical events.' },
  { id: 'commercial', item: 'Commercial operations / warehouse usage / factory / any manufacturing activity', description: 'Losses when the home is used for non-residential, high-risk commercial purposes.' },
  { id: 'ageingBuilding', item: 'Collapse or damage to the home due to natural ageing or poor maintenance', description: 'Damage resulting from neglect, wear and tear, or structural decay.' },
  { id: 'ageingContents', item: 'Damages to insured home contents due to ageing, mishandling, termites, or any other avoidable situation', description: 'Damage to contents resulting from maintenance issues or policyholder mishandling.' },
  { id: 'manufacturing', item: 'Manufacturing defects', description: 'Damages caused by defects inherent in the product itself.' },
  { id: 'renovation', item: 'Damages incurred by the home due to mishandling, dismantling or renovation process that may lead to structural damages and losses', description: 'Damage caused during active renovation or dismantling processes.' },
  { id: 'wilfulActs', item: 'Burglary, theft or losses caused under wilful acts or negligence of the policyholder', description: 'General burglary/theft (unless conditional as per the coverage list) and intentional/negligent acts by the policyholder.' },
  { id: 'digitalAssets', item: 'Damages or losses to the software, data, coding programs, etc.', description: 'Exclusion of intangible digital assets.' },
  { id: 'vehicles', item: 'Losses to motor and non-motor vehicles, livestock, etc.', description: 'Exclusion of vehicles (which need separate policies) and animals.' },
  { id: 'government', item: 'Destruction or damage to the property by the government', description: 'Actions by government authorities (e.g., expropriation, official demolition).' },
  { id: 'preExisting', item: 'Losses or damages incurred by the home before the policy coverage begins', description: 'Pre-existing damage or claims made for events that happened before the policy inception date.' },
];
