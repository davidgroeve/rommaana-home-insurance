import React, { useState } from 'react';
import { QuoteRequest, UserType, QuoteResult, OPTIONAL_COVERS, OptionalCoverageId } from '../types';
import { rommaanaApi } from '../services/api'; // Updated import
import { generateQuoteSummary } from '../services/geminiService';

const InfoTooltip: React.FC<{ text: string }> = ({ text }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative inline-block ml-1.5 group">
      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible(!visible)}
        className="text-gray-400 hover:text-pomegranate-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
      </button>
      {visible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl animate-fadeIn pointer-events-none">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
};

interface QuoteFormProps {
  onQuoteGenerated: (result: QuoteResult, request: QuoteRequest, summary: string) => void;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({ onQuoteGenerated }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<QuoteRequest>({
    userType: UserType.OWNER,
    buildingValue: 500000,
    contentsValue: 50000,
    selectedOptions: [],
    startDate: new Date().toISOString().split('T')[0],
    durationYears: 1,
    domesticWorkersCount: 0,
    optionalCoverageValues: {}
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleOptionToggle = (key: OptionalCoverageId) => {
    setFormData(prev => {
      const isSelected = prev.selectedOptions.includes(key);
      const newOptions = isSelected
        ? prev.selectedOptions.filter(o => o !== key)
        : [...prev.selectedOptions, key];

      const newValues = { ...prev.optionalCoverageValues };
      if (isSelected) {
        delete newValues[key];
      }

      return {
        ...prev,
        selectedOptions: newOptions,
        optionalCoverageValues: newValues
      };
    });
  };

  const handleOptionValueChange = (key: OptionalCoverageId, value: string) => {
    setFormData(prev => ({
      ...prev,
      optionalCoverageValues: {
        ...prev.optionalCoverageValues,
        [key]: Number(value)
      }
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (currentStep === 1) {
      if (formData.userType === UserType.OWNER) {
        if (formData.buildingValue <= 0) {
          newErrors.buildingValue = 'Building value required';
          isValid = false;
        } else if (formData.buildingValue > 4000000) {
          newErrors.buildingValue = 'Maximum building coverage is SAR 4,000,000';
          isValid = false;
        }
      }

      if (formData.contentsValue <= 0) {
        newErrors.contentsValue = 'Contents value required';
        isValid = false;
      } else if (formData.contentsValue > 365000) {
        newErrors.contentsValue = 'Maximum contents coverage is SAR 365,000';
        isValid = false;
      }

      if (!formData.startDate) {
        newErrors.startDate = 'Start date required';
        isValid = false;
      }

      if (formData.domesticWorkersCount < 0) {
        newErrors.domesticWorkersCount = 'Invalid number';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await rommaanaApi.pricing.calculate(formData);
      const summary = await generateQuoteSummary(formData, result);
      onQuoteGenerated(result, formData, summary);
    } catch (error: any) {
      console.error("Calculation failed", error);
      alert(error.message || "Could not calculate quote");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-2xl mx-auto border border-gray-100">
      <div className="bg-gradient-to-r from-pomegranate-700 to-pomegranate-600 px-8 py-6 text-white">
        <h2 className="text-2xl font-bold">Get Your Instant Quote</h2>
        <p className="text-pomegranate-100 text-sm mt-1">Select your coverage needs below.</p>

        <div className="flex items-center mt-6 space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 rounded-full flex-1 transition-colors duration-300 ${step >= i ? 'bg-gold-500' : 'bg-pomegranate-800'}`} />
          ))}
        </div>
      </div>

      <div className="p-8">
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                I am a...
                <InfoTooltip text="Owner: You own the property. Tenant: You are renting the property." />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: UserType.OWNER })}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${formData.userType === UserType.OWNER ? 'border-pomegranate-600 bg-pomegranate-50 text-pomegranate-700 font-semibold' : 'border-gray-200 hover:border-pomegranate-200 text-gray-600'}`}
                >
                  <div className="text-2xl mb-1">🏠</div>
                  Home Owner
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: UserType.TENANT })}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${formData.userType === UserType.TENANT ? 'border-pomegranate-600 bg-pomegranate-50 text-pomegranate-700 font-semibold' : 'border-gray-200 hover:border-pomegranate-200 text-gray-600'}`}
                >
                  <div className="text-2xl mb-1">🔑</div>
                  Tenant
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2 font-arabic">
                  Policy Start Date
                  <InfoTooltip text="The date your insurance coverage begins. Cannot be in the past." />
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-pomegranate-500 outline-none bg-white text-gray-900 ${errors.startDate ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  Duration (Years)
                  <InfoTooltip text="Choose a multi-year policy to lock in current rates." />
                </label>
                <select
                  name="durationYears"
                  value={formData.durationYears}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pomegranate-500 outline-none bg-white text-gray-900"
                >
                  <option value={1}>1 Year</option>
                  <option value={2}>2 Years</option>
                  <option value={3}>3 Years</option>
                </select>
              </div>
            </div>

            {formData.userType === UserType.OWNER && (
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  Building Value (SAR)
                  <InfoTooltip text="Estimated cost to rebuild the structure. Exclude land value. Example: 250 sqm * 2000 SAR/sqm = 500k SAR." />
                </label>
                <input
                  type="number"
                  name="buildingValue"
                  value={formData.buildingValue}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-pomegranate-500 outline-none bg-white text-gray-900 ${errors.buildingValue ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="e.g. 1000000"
                />
                {errors.buildingValue && <p className="text-xs text-red-600 mt-1 font-medium">{errors.buildingValue}</p>}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  Contents Value (SAR)
                  <InfoTooltip text="Total value of furniture, electronics, and belongings. Example: TV, sofa, appliances, clothes." />
                </label>
                <input
                  type="number"
                  name="contentsValue"
                  value={formData.contentsValue}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-pomegranate-500 outline-none bg-white text-gray-900 ${errors.contentsValue ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="e.g. 50000"
                />
                {errors.contentsValue && <p className="text-xs text-red-600 mt-1 font-medium">{errors.contentsValue}</p>}
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  Domestic Workers
                  <InfoTooltip text="Number of staff legally under your sponsorship for liability coverage (e.g., drivers, maids)." />
                </label>
                <input
                  type="number"
                  name="domesticWorkersCount"
                  min={0}
                  value={formData.domesticWorkersCount}
                  onChange={handleInputChange}
                  className={`w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-pomegranate-500 outline-none bg-white text-gray-900`}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-900">Optional Coverages</h3>
            <p className="text-sm text-gray-500">Select additional options to enhance your protection.</p>

            <div className="space-y-3">
              {Object.entries(OPTIONAL_COVERS).map(([key, label]) => {
                const isSelected = formData.selectedOptions.includes(key as OptionalCoverageId);
                return (
                  <div key={key} className={`rounded-xl border-2 transition-all p-4 ${isSelected ? 'border-pomegranate-600 bg-pomegranate-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center justify-between cursor-pointer" onClick={() => handleOptionToggle(key as OptionalCoverageId)}>
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-pomegranate-600 bg-pomegranate-600' : 'border-gray-300'}`}>
                          {isSelected && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className={`font-medium ${isSelected ? 'text-pomegranate-900' : 'text-gray-700'}`}>{label}</span>
                      </div>
                    </div>

                    {isSelected && key === 'JEWELLERY' && (
                      <div className="mt-4 animate-slideDown">
                        <label className="block text-xs font-bold text-pomegranate-700 uppercase mb-1">Itemized Value (SAR)</label>
                        <input
                          type="number"
                          placeholder="Enter value..."
                          value={formData.optionalCoverageValues[key as OptionalCoverageId] || ''}
                          onChange={(e) => handleOptionValueChange(key as OptionalCoverageId, e.target.value)}
                          className="w-full border-b border-pomegranate-200 bg-transparent py-1 text-sm text-pomegranate-900 focus:border-pomegranate-600 outline-none"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-900">Review & Confirm</h3>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-4">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div>
                  <span className="text-gray-500 block">User Type</span>
                  <span className="font-semibold text-gray-900">{formData.userType === UserType.OWNER ? 'Home Owner' : 'Tenant'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Policy Start</span>
                  <span className="font-semibold text-gray-900">{formData.startDate}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Duration</span>
                  <span className="font-semibold text-gray-900">{formData.durationYears} {formData.durationYears === 1 ? 'Year' : 'Years'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Domestic Workers</span>
                  <span className="font-semibold text-gray-900">{formData.domesticWorkersCount === 0 ? 'None' : formData.domesticWorkersCount}</span>
                </div>
                {formData.userType === UserType.OWNER && (
                  <div>
                    <span className="text-gray-500 block">Building Value</span>
                    <span className="font-semibold text-gray-900">{formData.buildingValue.toLocaleString()} SAR</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500 block">Contents Value</span>
                  <span className="font-semibold text-gray-900">{formData.contentsValue.toLocaleString()} SAR</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <span className="text-gray-500 block mb-2 text-sm">Additional Options</span>
                {formData.selectedOptions.length > 0 ? (
                  <div className="space-y-2">
                    {formData.selectedOptions.map(opt => (
                      <div key={opt} className="flex justify-between items-center text-xs">
                        <span className="bg-pomegranate-100 text-pomegranate-700 px-2 py-1 rounded font-medium">{OPTIONAL_COVERS[opt]}</span>
                        {opt === 'JEWELLERY' && (
                          <span className="text-gray-600">Value: SAR {(formData.optionalCoverageValues[opt] || 0).toLocaleString()}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm italic">None selected</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex justify-between items-center">
        {step > 1 ? (
          <button onClick={handleBack} className="text-gray-600 hover:text-pomegranate-700 font-medium text-sm px-4 py-2">Back</button>
        ) : <div />}

        {step < 3 ? (
          <button onClick={handleNext} className="bg-pomegranate-600 hover:bg-pomegranate-700 text-white px-8 py-3 rounded-lg font-medium shadow-md transition-all">Continue</button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all hover:shadow-lg disabled:opacity-70 flex items-center gap-2"
          >
            {loading ? 'Finding Best Plan...' : 'Get Price'}
          </button>
        )}
      </div>
    </div>
  );
}