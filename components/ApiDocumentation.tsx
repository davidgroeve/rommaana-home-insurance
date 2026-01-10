import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const ApiDocumentation: React.FC = () => {
    const { t } = useLanguage();
    const [activeLang, setActiveLang] = useState<'js' | 'curl' | 'python'>('js');

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Code copied to clipboard!');
    };

    const codeSnippets = {
        js: `// 1. Calculate Premium
const response = await fetch('https://api.rommaana.com/v1/calculate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_B2B_KEY'
  },
  body: JSON.stringify({
    userType: 'OWNER',
    buildingValue: 500000,
    contentsValue: 100000,
    selectedOptions: ['JEWELLERY'],
    durationYears: 1
  })
});
const result = await response.json();
console.log('Total Premium:', result.totalPremium);`,

        curl: `curl -X POST https://api.rommaana.com/v1/calculate \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_B2B_KEY" \\
  -d '{
    "userType": "OWNER",
    "buildingValue": 500000,
    "contentsValue": 100000,
    "selectedOptions": ["JEWELLERY"],
    "durationYears": 1
  }'`,

        python: `import requests

url = "https://api.rommaana.com/v1/calculate"
payload = {
    "userType": "OWNER",
    "buildingValue": 500000,
    "contentsValue": 100000,
    "selectedOptions": ["JEWELLERY"],
    "durationYears": 1
}
headers = {
    "Content-Type": "application/json",
    "x-api-key": "YOUR_B2B_KEY"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`
    };

    return (
        <div className="space-y-8 animate-fadeIn pb-12">
            {/* Introduction */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t('apiDocs.title')}</h2>
                <p className="text-gray-600 leading-relaxed">
                    {t('apiDocs.description')}
                </p>
            </div>

            {/* API Endpoint Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded">POST</span>
                        <code className="text-sm font-bold text-gray-800">/v1/calculate</code>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">{t('apiDocs.calculate.desc')}</p>
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">{t('apiDocs.calculate.headers')}</h4>
                        <ul className="text-xs space-y-1 font-mono">
                            <li className="text-gray-700"><span className="text-pomegranate-600">x-api-key</span>: Your Partner Key</li>
                            <li className="text-gray-700"><span className="text-pomegranate-600">Content-Type</span>: application/json</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded">POST</span>
                        <code className="text-sm font-bold text-gray-800">/v1/submit-quote</code>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">{t('apiDocs.submit.desc')}</p>
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">{t('apiDocs.submit.data')}</h4>
                        <p className="text-[10px] text-gray-400 italic">{t('apiDocs.submit.dataDesc')}</p>
                    </div>
                </div>
            </div>

            {/* Code Playground */}
            <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
                <div className="px-6 py-4 bg-gray-800 flex justify-between items-center">
                    <div className="flex gap-4">
                        {(['js', 'curl', 'python'] as const).map(lang => (
                            <button
                                key={lang}
                                onClick={() => setActiveLang(lang)}
                                className={`text-xs font-bold transition-colors ${activeLang === lang ? 'text-white border-b-2 border-pomegranate-500 pb-1' : 'text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => copyToClipboard(codeSnippets[activeLang])}
                        className="text-gray-400 hover:text-white flex items-center gap-1 text-[10px] uppercase font-bold transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                        </svg>
                        {t('apiDocs.copySnippet')}
                    </button>
                </div>
                <div className="p-6">
                    <pre className="font-mono text-sm text-green-400 overflow-x-auto">
                        {codeSnippets[activeLang]}
                    </pre>
                </div>
            </div>

            {/* Embedded Code Generator */}
            <div className="bg-pomegranate-900 rounded-xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>

                <div className="relative z-10 max-w-2xl">
                    <h3 className="text-xl font-bold mb-4">{t('apiDocs.widget.title')}</h3>
                    <p className="text-pomegranate-100 text-sm mb-6 leading-relaxed">
                        {t('apiDocs.widget.description')}
                    </p>

                    <div className="bg-black/30 p-4 rounded-lg font-mono text-xs border border-white/10 relative group">
                        <code className="text-pomegranate-200">
                            {`<script src="https://cdn.rommaana.com/v1/widget.js"></script>\n<div id="rommaana-quote-form" \n     data-api-key="YOUR_B2B_KEY" \n     data-theme="light"></div>`}
                        </code>
                        <button
                            onClick={() => copyToClipboard(`<script src="https://cdn.rommaana.com/v1/widget.js"></script>\n<div id="rommaana-quote-form" \ndata-api-key="YOUR_B2B_KEY" \ndata-theme="light"></div>`)}
                            className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 rounded transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
