import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const HowItWorks: React.FC = () => {
    const { t, language } = useLanguage();
    const isRtl = language === 'ar';

    const lifecycleSteps = [
        {
            title: t('howItWorks.steps.auth.title'),
            status: t('howItWorks.statuses.secure'),
            desc: t('howItWorks.steps.auth.desc'),
            icon: "🔑"
        },
        {
            title: t('howItWorks.steps.pricing.title'),
            status: t('howItWorks.statuses.fast'),
            desc: t('howItWorks.steps.pricing.desc'),
            icon: "💎"
        },
        {
            title: t('howItWorks.steps.data.title'),
            status: t('howItWorks.statuses.sync'),
            desc: t('howItWorks.steps.data.desc'),
            icon: "📜"
        },
        {
            title: t('howItWorks.steps.issuance.title'),
            status: t('howItWorks.statuses.final'),
            desc: t('howItWorks.steps.issuance.desc'),
            icon: "✉️"
        }
    ];

    return (
        <div className="space-y-16 animate-fadeIn pb-24">
            {/* Hero Section (The "Loved" one) */}
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-slate-900 group">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 opacity-80"></div>
                <img
                    src="/assets/api_nexus.png"
                    alt="Rommaana API Nexus"
                    className="w-full h-[450px] object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-10 z-20">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-pomegranate-600 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase shadow-lg shadow-pomegranate-900/50">{t('howItWorks.coreTechnology')}</span>
                    </div>
                    <h2 className="text-5xl font-black text-white mb-4 tracking-tight">
                        {t('admin.howItWorks')}
                    </h2>
                    <p className="text-slate-300 max-w-2xl text-xl leading-relaxed font-medium">
                        {t('howItWorks.heroSubtitle')}
                    </p>
                </div>
            </div>

            {/* Part 1: Interaction Flow (The Premium Step-by-Step) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`space-y-8 ${isRtl ? 'order-first lg:order-last' : ''}`}>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 font-bold text-xs border border-slate-200">
                        {t('howItWorks.integrationPhases')}
                    </div>
                    <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t('howItWorks.lifecycleTitle')}</h3>

                    <div className="grid grid-cols-1 gap-4">
                        {[
                            {
                                step: "01",
                                title: t('howItWorks.steps.auth.title'),
                                desc: t('howItWorks.steps.auth.desc')
                            },
                            {
                                step: "02",
                                title: t('howItWorks.steps.pricing.title'),
                                desc: t('howItWorks.steps.pricing.desc')
                            },
                            {
                                step: "03",
                                title: t('howItWorks.steps.embedded.title'),
                                desc: t('howItWorks.steps.embedded.desc')
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-6 p-6 rounded-2xl border border-gray-100 bg-white hover:border-pomegranate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                <span className="text-4xl font-black text-pomegranate-50 group-hover:text-pomegranate-100 transition-colors">{item.step}</span>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h4>
                                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-12 text-white shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pomegranate-600/10 blur-[120px]"></div>
                    <h4 className="text-sm font-bold text-pomegranate-400 uppercase tracking-widest mb-10">{t('howItWorks.architecture.liveMesh')}</h4>

                    <div className="relative h-[300px] flex items-center justify-center">
                        <div className="absolute w-24 h-24 rounded-full bg-pomegranate-600 shadow-[0_0_80px_rgba(225,29,72,0.4)] flex items-center justify-center animate-pulse z-20">
                            <span className="text-3xl mb-1">🏠</span>
                        </div>

                        <div className="absolute inset-0">
                            {[0, 72, 144, 216, 288].map((angle, i) => (
                                <div key={i} className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${angle}deg)` }}>
                                    <div className="w-1 h-32 bg-gradient-to-t from-pomegranate-500/0 via-pomegranate-500/40 to-pomegranate-500/0 mb-32 relative">
                                        <div className="absolute top-0 -mt-8 -rotate-inherit">
                                            <div className="p-3 bg-slate-800 rounded-lg border border-white/10 shadow-lg text-lg" style={{ transform: `rotate(-${angle}deg)` }}>
                                                {["🏦", "🏗️", "📱", "💼", "🏢"][i]}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Part 2: Technical Architecture Section (The New "Schema" Section) */}
            <div className="space-y-12">
                <div className="text-center max-w-2xl mx-auto">
                    <h3 className="text-3xl font-black text-gray-900 mb-4">{t('howItWorks.architecture.title')}</h3>
                    <p className="text-gray-500 italic">{t('howItWorks.architecture.subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {lifecycleSteps.map((step, i) => (
                        <div key={i} className="relative p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:border-pomegranate-200 transition-all duration-500 group overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-gray-50 rounded-full group-hover:bg-pomegranate-50 transition-colors duration-500"></div>

                            <div className="relative z-10">
                                <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-500 inline-block">{step.icon}</div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">{step.status}</span>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">{step.desc}</p>
                            </div>

                            {i < lifecycleSteps.length - 1 && (
                                <div className="hidden md:block absolute top-1/2 -right-4 translate-y-[-50%] z-20">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-200">
                                        <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Mechanics Table (Redesigned) */}
                <div className="bg-slate-50 rounded-3xl p-10 border border-gray-200 overflow-hidden shadow-inner">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <h4 className="text-xl font-bold text-gray-900">{t('howItWorks.architecture.integrationCore')}</h4>
                            <div className="space-y-4">
                                {[
                                    { label: t('howItWorks.architecture.apiSecret'), val: "rh_live_7x9k..." },
                                    { label: t('howItWorks.architecture.schema'), val: "QuoteRequest v2.1" },
                                    { label: t('howItWorks.architecture.sla'), val: "99.9% Availability" }
                                ].map((m, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <span className="text-xs font-bold text-gray-400 uppercase">{m.label}</span>
                                        <span className="text-xs font-mono font-bold text-pomegranate-600">{m.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-slate-900 rounded-2xl border border-white/5 font-mono text-[11px] leading-6 shadow-2xl">
                            <div className="flex gap-1.5 mb-4">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/30"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/30"></div>
                            </div>
                            <span className="text-blue-400">await</span> <span className="text-green-400">fetch</span>(<span className="text-yellow-400">'/v1/calculate'</span>, &#123;<br />
                            &nbsp;&nbsp;method: <span className="text-yellow-400">'POST'</span>,<br />
                            &nbsp;&nbsp;headers: &#123; <span className="text-white">'x-api-key'</span>: <span className="text-pomegranate-400">'rh_secret_...'</span> &#125;<br />
                            &#125;);
                        </div>
                    </div>
                </div>
            </div>

            {/* Quality Statement (Final Touch) */}
            <div className="bg-pomegranate-600 rounded-[2.5rem] p-12 text-white relative overflow-hidden text-center shadow-2xl shadow-pomegranate-900/30">
                <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                    <p className="text-pomegranate-200 text-sm uppercase font-black tracking-[0.4em]">{t('howItWorks.quality.tagline')}</p>
                    <h3 className="text-4xl font-black leading-tight">{t('howItWorks.quality.title')}</h3>
                    <p className="text-pomegranate-100/90 text-lg leading-relaxed font-medium">
                        {t('howItWorks.quality.desc')}
                    </p>
                </div>
            </div>
        </div>
    );
};
