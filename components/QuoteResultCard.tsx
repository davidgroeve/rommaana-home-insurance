import React, { useState } from 'react';
import { QuoteResult, QuoteRequest, OPTIONAL_COVERS, UserType } from '../types';

interface QuoteResultCardProps {
    result: QuoteResult;
    request: QuoteRequest;
    summary: string;
    onReset: () => void;
    onRequestQuote: () => void;
    onViewDetailedCoverage: () => void;
    isProcessing: boolean;
}

export const QuoteResultCard: React.FC<QuoteResultCardProps> = ({ result, request, summary, onReset, onRequestQuote, onViewDetailedCoverage, isProcessing }) => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-slideUp">
            <div className="bg-pomegranate-900 p-8 text-white relative overflow-hidden">
                {/* Abstract Pattern background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold-500 opacity-10 rounded-full -ml-10 -mb-10"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-medium text-pomegranate-200 uppercase tracking-wider">Total Annual Premium</h3>
                        <span className="bg-gold-500 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">{result.schemeName}</span>
                    </div>

                    <div className="flex items-baseline gap-2">
                        <span className="text-lg text-pomegranate-200">SAR</span>
                        <span className="text-5xl font-bold text-white">{result.totalPremium.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-pomegranate-300 mt-1">Inclusive of VAT</p>

                    <div className="mt-6 bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10">
                        <p className="text-sm italic text-pomegranate-50 leading-relaxed">"{summary}"</p>
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-semibold">Reference ID</p>
                        <p className="text-gray-800 font-mono">{result.referenceId}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase font-semibold">Coverage Package</p>
                        <p className="text-gray-800 font-medium">
                            {result.schemeName}
                        </p>
                    </div>
                </div>

                {/* Coverage Highlights - Main Items */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Public Liability</p>
                        <p className="font-bold text-gray-900">SAR {result.details.publicLiability.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Contents Total</p>
                        <p className="font-bold text-gray-900">SAR {result.limits.contents.toLocaleString()}</p>
                    </div>
                    {request.userType === UserType.OWNER && (
                        <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                            <p className="text-xs text-gray-500">Building Coverage</p>
                            <p className="font-bold text-gray-900">SAR {result.limits.building.toLocaleString()}</p>
                        </div>
                    )}
                </div>

                {/* Detailed Breakdown Toggle */}
                <div className="mb-6">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center gap-2 text-pomegranate-600 text-sm font-semibold hover:text-pomegranate-700 transition-colors w-full"
                    >
                        {showDetails ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                        )}
                        {showDetails ? "Hide Full Coverage Details" : "View Full Coverage Details"}
                    </button>

                    {showDetails && (
                        <div className="mt-4 border rounded-lg overflow-hidden animate-fadeIn text-sm">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                                    <tr>
                                        <th className="px-4 py-2 font-semibold">Cover Category</th>
                                        <th className="px-4 py-2 font-semibold text-right">Limit (SAR)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-gray-700">
                                    {request.userType === UserType.OWNER && (
                                        <>
                                            <tr><td className="px-4 py-2">Building Coverage</td><td className="px-4 py-2 text-right font-medium">{result.limits.building.toLocaleString()}</td></tr>
                                            <tr><td className="px-4 py-2 pl-8 text-gray-500">Building Rent</td><td className="px-4 py-2 text-right text-gray-500">{result.details.buildingRent.toLocaleString()}</td></tr>
                                        </>
                                    )}
                                    <tr><td className="px-4 py-2 bg-gray-50 font-medium">Contents Total</td><td className="px-4 py-2 bg-gray-50 text-right font-bold">{result.limits.contents.toLocaleString()}</td></tr>
                                    <tr><td className="px-4 py-2 pl-8 text-gray-500">Furniture, Fixtures</td><td className="px-4 py-2 text-right text-gray-500">{result.details.furniture.toLocaleString()}</td></tr>
                                    <tr><td className="px-4 py-2 pl-8 text-gray-500">Clothing</td><td className="px-4 py-2 text-right text-gray-500">{result.details.clothing.toLocaleString()}</td></tr>
                                    <tr><td className="px-4 py-2 pl-8 text-gray-500">Appliances</td><td className="px-4 py-2 text-right text-gray-500">{result.details.appliances.toLocaleString()}</td></tr>
                                    <tr><td className="px-4 py-2 pl-8 text-gray-500">TV / Home Theatre</td><td className="px-4 py-2 text-right text-gray-500">{result.details.tvAudio.toLocaleString()}</td></tr>
                                    <tr><td className="px-4 py-2 pl-8 text-gray-500">AC / Electronics</td><td className="px-4 py-2 text-right text-gray-500">{result.details.acElectronics.toLocaleString()}</td></tr>
                                    <tr><td className="px-4 py-2 pl-8 text-gray-500">Kitchen Crockery</td><td className="px-4 py-2 text-right text-gray-500">{result.details.kitchen.toLocaleString()}</td></tr>
                                    <tr><td className="px-4 py-2 pl-8 text-gray-500">Carpets</td><td className="px-4 py-2 text-right text-gray-500">{result.details.carpets.toLocaleString()}</td></tr>

                                    <tr><td className="px-4 py-2 bg-gray-50 font-medium">Liability & Others</td><td className="px-4 py-2 bg-gray-50"></td></tr>
                                    <tr><td className="px-4 py-2">Public Liability</td><td className="px-4 py-2 text-right font-medium">{result.details.publicLiability.toLocaleString()}</td></tr>
                                    <tr><td className="px-4 py-2">Domestic Staff Liability</td><td className="px-4 py-2 text-right">{result.details.domesticStaff.toLocaleString()}</td></tr>
                                    <tr><td className="px-4 py-2">Personal Accident (Owner/Spouse)</td><td className="px-4 py-2 text-right">{result.details.paOwner.toLocaleString()}</td></tr>
                                    <tr><td className="px-4 py-2">Burglary Limit</td><td className="px-4 py-2 text-right">{result.details.burglary.toLocaleString()}</td></tr>
                                    <tr><td className="px-4 py-2 text-red-500">Excess (Deductible)</td><td className="px-4 py-2 text-right text-red-500">-{result.details.excess.toLocaleString()}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <h4 className="font-semibold text-gray-900 mb-4">Pricing Breakdown</h4>
                <ul className="space-y-3 text-sm text-gray-600 mb-8">
                    <li className="flex justify-between">
                        <span>Base Premium ({result.schemeName})</span>
                        <span>SAR {result.breakdown.basePremium.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </li>
                    {result.breakdown.optionsCount > 0 && (
                        <li className="flex justify-between text-pomegranate-700">
                            <span>Optional Add-ons ({result.breakdown.optionsCount})</span>
                            <span>+ SAR {result.breakdown.optionsCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </li>
                    )}
                    {result.breakdown.domesticWorkerSurcharge > 0 && (
                        <li className="flex justify-between text-gray-700">
                            <span>Domestic Worker Surcharge</span>
                            <span>+ SAR {result.breakdown.domesticWorkerSurcharge.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </li>
                    )}
                    {result.breakdown.durationMultiplier > 1 && (
                        <li className="flex justify-between font-semibold text-pomegranate-600 pt-1">
                            <span>Multi-year Duration ({result.breakdown.durationMultiplier}x)</span>
                            <span>SAR {(result.netPremium / result.breakdown.durationMultiplier).toLocaleString(undefined, { minimumFractionDigits: 2 })} per year</span>
                        </li>
                    )}
                    <li className="flex justify-between pt-2 border-t border-dashed border-gray-200">
                        <span>VAT (5%)</span>
                        <span>SAR {result.vat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </li>
                </ul>

                {request.selectedOptions.length > 0 && (
                    <div className="mb-8">
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">Included Extras</h4>
                        <div className="flex flex-wrap gap-2">
                            {request.selectedOptions.map(opt => (
                                <span key={opt} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border border-gray-200">
                                    {OPTIONAL_COVERS[opt]}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        onClick={onRequestQuote}
                        disabled={isProcessing}
                        className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg shadow-md transition-all flex justify-center items-center gap-2"
                    >
                        {isProcessing ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            'Request Formal Quote'
                        )}
                    </button>

                    <button
                        onClick={onViewDetailedCoverage}
                        disabled={isProcessing}
                        className="w-full bg-white border-2 border-pomegranate-200 hover:bg-pomegranate-50 text-pomegranate-700 font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2 shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                        Full Coverage Details
                    </button>

                    <button
                        onClick={onReset}
                        disabled={isProcessing}
                        className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition-colors"
                    >
                        Recalculate
                    </button>
                </div>
            </div>
        </div>
    );
};
