import React, { useState } from 'react';
import { QuoteResult, QuoteRequest, OPTIONAL_COVERS, UserType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface QuoteResultCardProps {
    result: QuoteResult;
    request: QuoteRequest;
    onReset: () => void;
    onRequestQuote: () => void;
    onViewDetailedCoverage: () => void;
    isProcessing: boolean;
}

export const QuoteResultCard: React.FC<QuoteResultCardProps> = ({ result, request, onReset, onRequestQuote, onViewDetailedCoverage, isProcessing }) => {
    const { t } = useLanguage();
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-slideUp">
            <div className="bg-pomegranate-900 p-8 text-white relative overflow-hidden">
                {/* Abstract Pattern background */}
                <div className="absolute top-0 end-0 w-64 h-64 bg-white opacity-5 rounded-full -me-20 -mt-20"></div>
                <div className="absolute bottom-0 start-0 w-32 h-32 bg-gold-500 opacity-10 rounded-full -ms-10 -mb-10"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-medium text-pomegranate-200 uppercase tracking-wider">{t('results.totalPremium')}</h3>
                        <span className="bg-gold-500 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">{result.schemeName}</span>
                    </div>

                    <div className="flex items-baseline gap-2">
                        <span className="text-lg text-pomegranate-200">{t('common.sar')}</span>
                        <span className="text-5xl font-bold text-white">{result.totalPremium.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-pomegranate-300 mt-1">{t('results.inclusiveVat')}</p>


                    <div className="mt-8 grid grid-cols-2 gap-3">
                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/20">
                            <p className="text-[10px] uppercase text-pomegranate-200 font-bold mb-1">{t('results.publicLiability')}</p>
                            <p className="text-sm font-bold text-white">{t('common.sar')} {result.details.publicLiability.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/20">
                            <p className="text-[10px] uppercase text-pomegranate-200 font-bold mb-1">{t('results.contentsTotal')}</p>
                            <p className="text-sm font-bold text-white">{t('common.sar')} {result.limits.contents.toLocaleString()}</p>
                        </div>
                        {request.userType === UserType.OWNER && (
                            <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/20 col-span-2">
                                <p className="text-[10px] uppercase text-pomegranate-200 font-bold mb-1">{t('results.mainBuildingCoverage')}</p>
                                <p className="text-sm font-bold text-white">{t('common.sar')} {result.limits.building.toLocaleString()}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-semibold">{t('results.referenceId')}</p>
                        <p className="text-gray-800 font-mono">{result.referenceId}</p>
                    </div>
                    <div className="text-end">
                        <p className="text-xs text-gray-400 uppercase font-semibold">{t('results.coveragePackage')}</p>
                        <p className="text-gray-800 font-medium">
                            {result.schemeName}
                        </p>
                    </div>
                </div>

                {/* Coverage Highlights - Main Items */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">{t('results.publicLiability')}</p>
                        <p className="font-bold text-gray-900">{t('common.sar')} {result.details.publicLiability.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">{t('results.contentsTotal')}</p>
                        <p className="font-bold text-gray-900">{t('common.sar')} {result.limits.contents.toLocaleString()}</p>
                    </div>
                    {request.userType === UserType.OWNER && (
                        <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                            <p className="text-xs text-gray-500">{t('results.buildingCoverage')}</p>
                            <p className="font-bold text-gray-900">{t('common.sar')} {result.limits.building.toLocaleString()}</p>
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
                        {showDetails ? t('common.close') : t('results.viewCoverage')}
                    </button>

                    {showDetails && (
                        <div className="mt-4 border rounded-lg overflow-hidden animate-fadeIn text-sm">
                            <table className="w-full text-start">
                                <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                                    <tr>
                                        <th className="px-4 py-2 font-semibold text-start">{t('details.coverCategory')}</th>
                                        <th className="px-4 py-2 font-semibold text-end">{t('details.limitSar')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-gray-700">
                                    {request.userType === UserType.OWNER && (
                                        <>
                                            <tr><td className="px-4 py-2">{t('results.buildingCoverage')}</td><td className="px-4 py-2 text-end font-medium">{result.limits.building.toLocaleString()}</td></tr>
                                            <tr><td className="px-4 py-2 ps-8 text-gray-500">{t('details.buildingRent')}</td><td className="px-4 py-2 text-end text-gray-500">{result.details.buildingRent.toLocaleString()}</td></tr>
                                        </>
                                    )}
                                    <tr><td className="px-4 py-2 bg-gray-50 font-medium">{t('results.contentsTotal')}</td><td className="px-4 py-2 bg-gray-50 text-end font-bold">{result.limits.contents.toLocaleString()}</td></tr>
                                    <tr><td className="px-4 py-2 ps-8 text-gray-500">{t('details.furniture')}</td><td className="px-4 py-2 text-end text-gray-500">{result.details.furniture.toLocaleString()}</td></tr>
                                    <tr><td className="px-4 py-2 ps-8 text-gray-500">{t('details.clothing')}</td><td className="px-4 py-2 text-end text-gray-500">{result.details.clothing.toLocaleString()}</td></tr>
                                    <tr><td className="px-4 py-2 ps-8 text-gray-500">{t('details.appliances')}</td><td className="px-4 py-2 text-end text-gray-500">{result.details.appliances.toLocaleString()}</td></tr>
                                    <tr><td className="px-4 py-2 ps-8 text-gray-500">{t('details.tvAudio')}</td><td className="px-4 py-2 text-end text-gray-500">{result.details.tvAudio.toLocaleString()}</td></tr>
                                    <tr><td className="px-4 py-2 ps-8 text-gray-500">{t('details.acElectronics')}</td><td className="px-4 py-2 text-end text-gray-500">{result.details.acElectronics.toLocaleString()}</td></tr>
                                    <tr><td className="px-4 py-2 ps-8 text-gray-500">{t('details.kitchen')}</td><td className="px-4 py-2 text-end text-gray-500">{result.details.kitchen.toLocaleString()}</td></tr>
                                    <tr><td className="px-4 py-2 ps-8 text-gray-500">{t('details.carpets')}</td><td className="px-4 py-2 text-end text-gray-500">{result.details.carpets.toLocaleString()}</td></tr>
                                    <tr><td className="px-4 py-2 bg-gray-50 font-medium">{t('details.liabilityOthers')}</td><td className="px-4 py-2 bg-gray-50"></td></tr>
                                    <tr><td className="px-4 py-2">{t('results.publicLiability')}</td><td className="px-4 py-2 text-end font-medium">{result.details.publicLiability.toLocaleString()}</td></tr>
                                    <tr><td className="px-4 py-2">{t('details.domesticStaff')}</td><td className="px-4 py-2 text-end">{result.details.domesticStaff.toLocaleString()}</td></tr>
                                    <tr><td className="px-4 py-2">{t('details.paOwner')}</td><td className="px-4 py-2 text-end">{result.details.paOwner.toLocaleString()}</td></tr>
                                    <tr><td className="px-4 py-2">{t('details.burglary')}</td><td className="px-4 py-2 text-end">{result.details.burglary.toLocaleString()}</td></tr>
                                    <tr><td className="px-4 py-2 text-red-500">{t('details.excess')}</td><td className="px-4 py-2 text-end text-red-500">-{result.details.excess.toLocaleString()}</td></tr>

                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <h4 className="font-semibold text-gray-900 mb-4">{t('results.pricingBreakdown')}</h4>
                <ul className="space-y-3 text-sm text-gray-600 mb-8">
                    <li className="flex justify-between">

                        <span>{t('results.basePremium')} ({result.schemeName})</span>
                        <span>{t('common.sar')} {result.breakdown.basePremium.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </li>
                    {result.breakdown.optionsCount > 0 && (
                        <li className="flex justify-between text-pomegranate-700">
                            <span>{t('results.optionsCost')} ({result.breakdown.optionsCount})</span>
                            <span>+ {t('common.sar')} {result.breakdown.optionsCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </li>
                    )}
                    {result.breakdown.domesticWorkerSurcharge > 0 && (
                        <li className="flex justify-between text-gray-700">
                            <span>{t('results.workersCost')}</span>
                            <span>+ {t('common.sar')} {result.breakdown.domesticWorkerSurcharge.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </li>
                    )}
                    {result.breakdown.durationMultiplier > 1 && (
                        <li className="flex justify-between font-semibold text-pomegranate-600 pt-1">
                            <span>{t('results.multiYear')} ({result.breakdown.durationMultiplier}x)</span>
                            <span>{t('common.sar')} {(result.netPremium / result.breakdown.durationMultiplier).toLocaleString(undefined, { minimumFractionDigits: 2 })} {t('results.perYear')}</span>
                        </li>
                    )}
                    <li className="flex justify-between pt-2 border-t border-dashed border-gray-200">
                        <span>{t('results.vat')}</span>
                        <span>{t('common.sar')} {result.vat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </li>
                </ul>

                {request.selectedOptions.length > 0 && (
                    <div className="mb-8">
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">{t('results.includedExtras')}</h4>
                        <div className="flex flex-wrap gap-2">
                            {request.selectedOptions.map(opt => (
                                <span key={opt} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border border-gray-200">
                                    {t(`options.${opt}`)}
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
                                {t('results.processing')}
                            </>
                        ) : (
                            t('results.requestIssuance')
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
                        {t('results.viewCoverage')}
                    </button>

                    <button
                        onClick={onReset}
                        disabled={isProcessing}
                        className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition-colors"
                    >
                        {t('results.reset')}
                    </button>
                </div>
            </div>
        </div>
    );
};
