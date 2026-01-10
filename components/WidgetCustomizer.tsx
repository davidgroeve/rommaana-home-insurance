import React, { useState, useEffect } from 'react';
import { ApiKey } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface WidgetCustomizerProps {
    apiKey: ApiKey;
    onClose: () => void;
}

export const WidgetCustomizer: React.FC<WidgetCustomizerProps> = ({ apiKey, onClose }) => {
    const { t } = useLanguage();
    const [primaryColor, setPrimaryColor] = useState('#be123c'); // Default Pomegranate
    const [font, setFont] = useState('ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif');
    const [mode, setMode] = useState<'light' | 'dark'>('light');
    const [iframeUrl, setIframeUrl] = useState('');

    // Update preview URL
    useEffect(() => {
        const origin = window.location.origin;
        const url = new URL(`${origin}/embed`);
        url.searchParams.set('apiKey', apiKey.api_key);
        url.searchParams.set('primaryColor', primaryColor);
        url.searchParams.set('mode', mode);
        url.searchParams.set('font', font);
        setIframeUrl(url.toString());
    }, [apiKey, primaryColor, font, mode]);

    const copyCode = () => {
        const code = `<iframe src="${iframeUrl}" width="100%" height="800" frameborder="0"></iframe>`;
        navigator.clipboard.writeText(code);
        alert(t('widgetCustomizer.copied'));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex overflow-hidden">

                {/* Sidebar Controls */}
                <div className="w-80 border-e border-gray-200 p-6 flex flex-col bg-gray-50 h-full overflow-y-auto shrink-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">{t('widgetCustomizer.studio')}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-6 flex-1">
                        {/* Color Picker */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('widgetCustomizer.primaryColor')}</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="h-10 w-10 p-1 rounded cursor-pointer border border-gray-300"
                                />
                                <span className="text-sm font-mono text-gray-600 uppercase">{primaryColor}</span>
                            </div>
                        </div>

                        {/* Mode Toggle */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('widgetCustomizer.themeMode')}</label>
                            <div className="flex p-1 bg-gray-200 rounded-lg">
                                <button
                                    onClick={() => setMode('light')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'light' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    {t('widgetCustomizer.light')}
                                </button>
                                <button
                                    onClick={() => setMode('dark')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'dark' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    {t('widgetCustomizer.dark')}
                                </button>
                            </div>
                        </div>

                        {/* Font Selector */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('widgetCustomizer.typography')}</label>
                            <select
                                value={font}
                                onChange={(e) => setFont(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white"
                            >
                                <option value='ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'>System Sans</option>
                                <option value="'Times New Roman', Times, serif">Serif (Times)</option>
                                <option value="'Courier New', Courier, monospace">Monospace</option>
                                <option value="'Georgia', serif">Georgia</option>
                            </select>
                        </div>

                        {/* Partner Info */}
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                            <p className="text-xs text-blue-600 font-bold uppercase mb-1">{t('widgetCustomizer.activePartner')}</p>
                            <p className="text-sm text-blue-900 font-medium truncate">{apiKey.partner_name}</p>
                        </div>
                    </div>

                    {/* Embed Code */}
                    <div className="mt-8">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('widgetCustomizer.embedCode')}</label>
                        <div className="bg-gray-900 rounded-lg p-3 relative group">
                            <code className="text-[10px] text-green-400 font-mono break-all block leading-relaxed opacity-80">
                                &lt;iframe src="{iframeUrl}" width="100%" height="800" frameborder="0"&gt;&lt;/iframe&gt;
                            </code>
                            <button
                                onClick={copyCode}
                                className="absolute top-2 right-2 p-1.5 bg-gray-700 hover:bg-white hover:text-gray-900 text-gray-300 rounded transition-colors"
                                title="Copy to Clipboard"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                </svg>
                            </button>
                        </div>
                        <button onClick={copyCode} className="w-full mt-2 bg-pomegranate-600 hover:bg-pomegranate-700 text-white py-2 rounded-lg text-sm font-bold transition-all">
                            {t('widgetCustomizer.copyEmbed')}
                        </button>
                    </div>
                </div>

                {/* Preview Area */}
                <div className="flex-1 bg-gray-200 p-8 flex flex-col relative">
                    <div className="absolute top-4 left-8 text-xs font-bold text-gray-500 uppercase">{t('widgetCustomizer.livePreview')}</div>
                    <div className="flex-1 bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-300">
                        {iframeUrl && <iframe src={iframeUrl} className="w-full h-full" title={t('widgetCustomizer.livePreview')} />}
                    </div>
                </div>

            </div>
        </div>
    );
};
