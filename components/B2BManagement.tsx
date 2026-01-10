import React, { useState, useEffect } from 'react';
import { rommaanaApi } from '../services/api';
import { ApiKey } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

import { WidgetCustomizer } from './WidgetCustomizer';

export const B2BManagement: React.FC = () => {
    const { t } = useLanguage();
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newPartnerName, setNewPartnerName] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showKeyModal, setShowKeyModal] = useState<{ name: string, key: string } | null>(null);
    const [customizingKey, setCustomizingKey] = useState<ApiKey | null>(null);

    useEffect(() => {
        loadKeys();
    }, []);

    const loadKeys = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await rommaanaApi.b2b.getKeys();
            console.log("B2BManagement: Loaded keys:", data);
            setKeys(data);
        } catch (err: any) {
            console.error("B2BManagement: Failed to load B2B keys:", err);
            setError(err.message || "Failed to load partners. Please check if the 'api_keys' table exists and you have permissions.");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateKey = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPartnerName.trim()) return;

        try {
            setIsGenerating(true);
            setError(null);
            const key = await rommaanaApi.b2b.generateKey(newPartnerName);
            setShowKeyModal({ name: newPartnerName, key });
            setNewPartnerName('');
            loadKeys();
        } catch (err: any) {
            console.error("Failed to generate key:", err);
            setError("Failed to generate key: " + (err.message || "Unknown error"));
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRevokeKey = async (id: string) => {
        if (!confirm("Are you sure you want to revoke this API key? The partner will lose access immediately.")) return;
        try {
            await rommaanaApi.b2b.revokeKey(id);
            loadKeys();
        } catch (err: any) {
            console.error("Failed to revoke key:", err);
            setError("Failed to revoke key: " + (err.message || "Unknown error"));
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border-s-4 border-red-400 p-4 rounded-e-lg shadow-sm animate-pulse">
                    <div className="flex">
                        <div className="flex-shrink-0 text-red-400">
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                <strong>Database Error:</strong> {error}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {/* Header & Generator */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('b2b.generateTitle')}</h2>
                <form onSubmit={handleGenerateKey} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder={t('b2b.partnerName')}
                            value={newPartnerName}
                            onChange={(e) => setNewPartnerName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pomegranate-500 focus:border-pomegranate-500 outline-none transition-all"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isGenerating || !newPartnerName.trim()}
                        className="bg-pomegranate-600 hover:bg-pomegranate-700 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isGenerating ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        )}
                        {t('b2b.generate')}
                    </button>
                </form>
            </div>

            {/* Keys List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h2 className="font-bold text-gray-900">{t('b2b.activeTitle')}</h2>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">{keys.length} {t('b2b.totalKeys')}</span>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">{t('b2b.loading')}</div>
                ) : keys.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">{t('b2b.noKeys')}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-start">
                            <thead className="bg-gray-50 text-[10px] uppercase text-gray-500 font-bold border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3">{t('b2b.table.name')}</th>
                                    <th className="px-6 py-3">{t('b2b.table.snippet')}</th>
                                    <th className="px-6 py-3">{t('b2b.table.created')}</th>
                                    <th className="px-6 py-3">{t('b2b.table.status')}</th>
                                    <th className="px-6 py-3 text-end">{t('b2b.table.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {keys.map((key) => (
                                    <tr key={key.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{key.partner_name}</div>
                                            <div className="text-[10px] text-gray-400">ID: {key.id.substring(0, 8)}...</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 flex items-center gap-2">
                                                {key.api_key.substring(0, 10)}****************
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-500">
                                            {new Date(key.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${key.status === 'ACTIVE'
                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                : 'bg-red-100 text-red-700 border border-red-200'
                                                }`}>
                                                {key.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-end">
                                            {key.status === 'ACTIVE' && (
                                                <>
                                                    <button
                                                        onClick={() => handleRevokeKey(key.id)}
                                                        className="text-red-600 hover:text-red-700 text-xs font-bold transition-colors"
                                                    >
                                                        {t('b2b.revoke')}
                                                    </button>
                                                    <button
                                                        onClick={() => setCustomizingKey(key)}
                                                        className="text-pomegranate-600 hover:text-pomegranate-700 text-xs font-bold transition-colors ms-4 inline-flex items-center gap-1"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                                                        </svg>
                                                        Widget
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Success Modal for New Key */}
            {showKeyModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-scaleIn border-t-8 border-pomegranate-600">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{t('b2b.successTitle')}</h3>
                        <p className="text-gray-500 mt-2">{t('b2b.partner')}: <span className="font-bold text-pomegranate-700">{showKeyModal.name}</span></p>
                    </div>

                    <div className="bg-gray-900 rounded-xl p-4 mb-6 relative group">
                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-2">{t('b2b.secret')}</p>
                        <div className="font-mono text-green-400 break-all text-sm selection:bg-green-400 selection:text-gray-900">
                            {showKeyModal.key}
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(showKeyModal.key);
                                alert('Copied to clipboard!');
                            }}
                            className="absolute top-4 end-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                            </svg>
                        </button>
                    </div>

                    <button
                        onClick={() => setShowKeyModal(null)}
                        className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors"
                    >
                        {t('b2b.done')}
                    </button>
                </div>
            )
            }

            {customizingKey && (
                <WidgetCustomizer
                    apiKey={customizingKey}
                    onClose={() => setCustomizingKey(null)}
                />
            )}
        </div >
    );
};
