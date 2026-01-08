import React, { useState } from 'react';
import { CustomerDetails } from '../types';

interface RequestQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: CustomerDetails) => void;
  isSubmitting: boolean;
}

export const RequestQuoteModal: React.FC<RequestQuoteModalProps> = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [details, setDetails] = useState<CustomerDetails>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    nationalId: '',
    dob: '',
    streetAddress: '',
    streetNumber: '',
    floor: '',
    apartment: '',
    postalCode: '',
    neighborhood: '',
    city: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(details);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-pomegranate-700 p-6 text-white text-center relative shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 text-pomegranate-200 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold">Request Formal Policy</h2>
          <p className="text-pomegranate-200 text-sm mt-1">Please provide details for policy issuance.</p>
        </div>

        <div className="overflow-y-auto p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-4">
              <p className="text-xs text-blue-700">
                <span className="font-bold">Note:</span> These details are required by Saudi Insurance Regulation to issue your policy.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name (English)</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={details.firstName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pomegranate-500 outline-none bg-white text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name (English)</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={details.lastName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pomegranate-500 outline-none bg-white text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">National ID / Iqama (10 Digits)</label>
                <input
                  type="text"
                  name="nationalId"
                  required
                  pattern="\d{10}"
                  maxLength={10}
                  value={details.nationalId}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pomegranate-500 outline-none bg-white text-gray-900"
                  placeholder="10xxxxxxxxx"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  required
                  value={details.dob}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pomegranate-500 outline-none bg-white text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={details.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pomegranate-500 outline-none bg-white text-gray-900"
                  placeholder="+966 5..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={details.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pomegranate-500 outline-none bg-white text-gray-900"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <h4 className="font-bold text-gray-900 pt-2 border-t border-gray-100 italic text-sm">Full National Address</h4>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase">Street Address</label>
                <input type="text" name="streetAddress" required value={details.streetAddress} onChange={handleInputChange} className="w-full border-b border-gray-300 py-1 text-sm outline-none focus:border-pomegranate-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase">Number</label>
                <input type="text" name="streetNumber" required value={details.streetNumber} onChange={handleInputChange} className="w-full border-b border-gray-300 py-1 text-sm outline-none focus:border-pomegranate-500" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase">Floor</label>
                <input type="text" name="floor" required value={details.floor} onChange={handleInputChange} className="w-full border-b border-gray-300 py-1 text-sm outline-none focus:border-pomegranate-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase">Apartment</label>
                <input type="text" name="apartment" required value={details.apartment} onChange={handleInputChange} className="w-full border-b border-gray-300 py-1 text-sm outline-none focus:border-pomegranate-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase">Postal Code</label>
                <input type="text" name="postalCode" required value={details.postalCode} onChange={handleInputChange} className="w-full border-b border-gray-300 py-1 text-sm outline-none focus:border-pomegranate-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase">Neighborhood</label>
                <input type="text" name="neighborhood" required value={details.neighborhood} onChange={handleInputChange} className="w-full border-b border-gray-300 py-1 text-sm outline-none focus:border-pomegranate-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase">City</label>
                <input type="text" name="city" required value={details.city} onChange={handleInputChange} className="w-full border-b border-gray-300 py-1 text-sm outline-none focus:border-pomegranate-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 rounded-lg shadow-md transition-colors flex justify-center items-center mt-6"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};