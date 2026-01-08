import React from 'react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-scaleIn">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10 text-green-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Congratulations!</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    We will contact you very soon with the best option for your Home.
                </p>
                
                <button 
                    onClick={onClose}
                    className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 rounded-xl shadow-md transition-all hover:shadow-lg transform active:scale-95"
                >
                    Done
                </button>
            </div>
        </div>
    );
};