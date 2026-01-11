import React, { useState } from 'react';
import { DETAILED_COVERAGES, EXCLUSIONS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface CoverageModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CoverageModal: React.FC<CoverageModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'COVERAGE' | 'EXCLUSIONS'>('COVERAGE');

    if (!isOpen) return null;

    // Group coverages by category
    const categoryIds = Array.from(new Set(DETAILED_COVERAGES.map(c => c.categoryId)));

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto px-4 py-6 sm:px-0 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fadeIn"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scaleIn flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-pomegranate-50">
                    <div>
                        <h2 className="text-xl font-bold text-pomegranate-900">{t('coverage.title')}</h2>
                        <p className="text-sm text-pomegranate-700 mt-0.5">{t('coverage.subtitle')}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-pomegranate-100 rounded-lg transition-colors text-pomegranate-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tab Switcher */}
                <div className="flex border-b border-gray-100 shrink-0">
                    <button
                        onClick={() => setActiveTab('COVERAGE')}
                        className={`flex-1 py-4 text-sm font-bold transition-colors relative ${activeTab === 'COVERAGE'
                            ? 'text-pomegranate-600'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        {t('coverage.inclusions')}
                        {activeTab === 'COVERAGE' && (
                            <div className="absolute bottom-0 start-0 end-0 h-1 bg-pomegranate-600 animate-fadeIn"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('EXCLUSIONS')}
                        className={`flex-1 py-4 text-sm font-bold transition-colors relative ${activeTab === 'EXCLUSIONS'
                            ? 'text-pomegranate-600'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        {t('coverage.exclusions')}
                        {activeTab === 'EXCLUSIONS' && (
                            <div className="absolute bottom-0 start-0 end-0 h-1 bg-pomegranate-600 animate-fadeIn"></div>
                        )}
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'COVERAGE' ? (
                        <div className="space-y-8 animate-fadeIn">
                            {categoryIds.map((categoryId) => (
                                <div key={categoryId} className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                                        <span className="w-2 h-6 bg-gold-500 rounded-full"></span>
                                        {t(`coverage_data.categories.${categoryId}`)}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {DETAILED_COVERAGES.filter(c => c.categoryId === categoryId).map((item, idx) => (
                                            <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-pomegranate-200 transition-colors group">
                                                <h4 className="font-semibold text-pomegranate-800 mb-1 group-hover:text-pomegranate-600 transition-colors">
                                                    {t(`coverage_data.events.${item.id}`)}
                                                </h4>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {t(`coverage_data.descriptions.${item.id}`)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4 animate-fadeIn">
                            <div className="bg-red-50 border-s-4 border-red-400 p-4 mb-6">
                                <div className="flex">
                                    <div className="shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ms-3">
                                        <p className="text-sm text-red-700">
                                            {t('coverage.exclusionNotice')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {EXCLUSIONS.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1">{t(`coverage_data.exclusions.items.${item.id}`)}</h4>
                                            <p className="text-sm text-gray-500 leading-relaxed">{t(`coverage_data.exclusions.descriptions.${item.id}`)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="bg-pomegranate-600 hover:bg-pomegranate-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm"
                    >
                        {t('coverage.close')}
                    </button>
                </div>
            </div>
        </div>
    );
};
