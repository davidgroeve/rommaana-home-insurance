import React, { useEffect, useState } from 'react';
import { QuoteForm } from './QuoteForm';
import { QuoteResult, QuoteRequest } from '../types';
import { QuoteResultCard } from './QuoteResultCard';
import { RequestQuoteModal } from './RequestQuoteModal';
import { SuccessModal } from './SuccessModal';
import { rommaanaApi } from '../services/api';

interface EmbeddedWidgetProps {
    apiKey?: string;
    primaryColor?: string;
    font?: string;
    mode?: 'light' | 'dark';
}

export const EmbeddedWidget: React.FC<EmbeddedWidgetProps> = (props) => {
    // Parse URL params if props are missing (for standalone Route usage)
    const queryParams = new URLSearchParams(window.location.search);
    const primaryColor = props.primaryColor || queryParams.get('primaryColor') || '#be123c';
    const font = props.font || queryParams.get('font') || 'sans-serif';
    const mode = (props.mode || queryParams.get('mode') || 'light') as 'light' | 'dark';
    const apiKey = props.apiKey || queryParams.get('apiKey');

    // State
    const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
    const [quoteRequest, setQuoteRequest] = useState<QuoteRequest | null>(null);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Apply Styles dynamically
    useEffect(() => {
        // Set Font
        document.body.style.fontFamily = font;

        // Set Mode (Background)
        if (mode === 'dark') {
            document.body.classList.add('dark');
            document.body.style.backgroundColor = '#111827'; // gray-900
            document.body.style.color = '#f3f4f6'; // gray-100
        } else {
            document.body.classList.remove('dark');
            document.body.style.backgroundColor = '#ffffff';
            document.body.style.color = '#111827';
        }

        // Set Primary Color CSS Variables
        // We assume the Tailwind config or CSS uses these, or we inject a style tag to override classes
        // unique to this widget wrapper.
        const root = document.documentElement;
        root.style.setProperty('--color-primary', primaryColor);

        // Inject dynamic style for overrides
        const styleId = 'widget-dynamic-styles';
        let styleTag = document.getElementById(styleId);
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = styleId;
            document.head.appendChild(styleTag);
        }

        // Override common Tailwind classes used in QuoteForm with the custom color
        // note: This is a hacky way to "theme" tailwind classes without a full config rebuild.
        // For a robust solution, we'd use CSS variables in tailwind.config.js.
        // Here we will use specific attribute selectors or !important to force color changes on key elements.
        styleTag.innerHTML = `
      .bg-pomegranate-600, .bg-pomegranate-700 { background-color: ${primaryColor} !important; }
      .text-pomegranate-600, .text-pomegranate-700 { color: ${primaryColor} !important; }
      .border-pomegranate-600 { border-color: ${primaryColor} !important; }
      .focus\\:ring-pomegranate-500:focus { --tw-ring-color: ${primaryColor} !important; }
      
      ${mode === 'dark' ? `
        .bg-white { background-color: #1f2937 !important; border-color: #374151 !important; color: #f3f4f6 !important; }
        .text-gray-900 { color: #f9fafb !important; }
        .text-gray-700 { color: #d1d5db !important; }
        .text-gray-600 { color: #9ca3af !important; }
        .text-gray-500 { color: #9ca3af !important; }
        .bg-gray-50 { background-color: #111827 !important; }
        .border-gray-200, .border-gray-100 { border-color: #374151 !important; }
        input, select { background-color: #374151 !important; border-color: #4b5563 !important; color: white !important; }
      ` : ''}
    `;

    }, [primaryColor, font, mode]);

    const handleQuoteGenerated = (result: QuoteResult, request: QuoteRequest) => {
        setQuoteResult(result);
        setQuoteRequest(request);
    };

    const handleSubmitRequest = async (customerDetails: any) => {
        if (!quoteResult || !quoteRequest) return;
        setIsSubmitting(true);
        try {
            await rommaanaApi.quotes.submit({
                customer: customerDetails,
                quoteRequest,
                quoteResult
            });
            setIsRequestModalOpen(false);
            setIsSuccessModalOpen(true);
        } catch (e) {
            console.error(e);
            alert("Failed to submit. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`min-h-screen p-4 ${mode === 'dark' ? 'dark' : ''}`}>
            {!quoteResult ? (
                <div className="max-w-xl mx-auto">
                    <QuoteForm onQuoteGenerated={handleQuoteGenerated} />
                </div>
            ) : (
                <div className="max-w-xl mx-auto">
                    <QuoteResultCard
                        result={quoteResult}
                        request={quoteRequest!}
                        onReset={() => { setQuoteResult(null); setQuoteRequest(null); }}
                        onRequestQuote={() => setIsRequestModalOpen(true)}
                        onViewDetailedCoverage={() => { }}
                        isProcessing={false}
                    />
                </div>
            )}

            <RequestQuoteModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
                onSubmit={handleSubmitRequest}
                isSubmitting={isSubmitting}
            />

            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
            />
        </div>
    );
};
