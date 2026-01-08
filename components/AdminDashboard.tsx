import React, { useEffect, useState } from 'react';
import { FormalQuoteRequest, User } from '../types';
import { rommaanaApi } from '../services/api';
import { pdfService } from '../services/pdfService';
import { emailService } from '../services/emailService';
import { B2BManagement } from './B2BManagement';
import { ApiDocumentation } from './ApiDocumentation';

interface AdminDashboardProps {
  user: User;
}

type AdminTab = 'ISSUANCE' | 'PARTNERS' | 'DOCUMENTATION';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('ISSUANCE');
  const [requests, setRequests] = useState<FormalQuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<{ id: string; success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (activeTab === 'ISSUANCE') {
      loadRequests();
    }
  }, [activeTab]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await rommaanaApi.quotes.getAll();
      setRequests(data);
    } catch (err) {
      console.error("AdminDashboard: Error loading requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (req: FormalQuoteRequest) => {
    setSendingEmail(req.id);
    setEmailStatus(null);
    try {
      const result = await emailService.sendQuoteDocuments(req);
      setEmailStatus({ id: req.id, success: result.success, message: result.message });
      setTimeout(() => setEmailStatus(null), 5000);
    } catch (err) {
      setEmailStatus({ id: req.id, success: false, message: "Failed to send emails." });
    } finally {
      setSendingEmail(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full border border-red-200">ADMIN ACCESS</span>
          <h1 className="text-3xl font-bold text-gray-900">Admin Central</h1>
        </div>
        <p className="text-gray-500 mt-2">Manage policy issuance, B2B partners, and API integrations.</p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl mb-8 w-fit border border-gray-200 shadow-inner">
        <button
          onClick={() => setActiveTab('ISSUANCE')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'ISSUANCE'
              ? 'bg-white text-pomegranate-600 shadow-md'
              : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          Policy Issuance
        </button>
        <button
          onClick={() => setActiveTab('PARTNERS')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'PARTNERS'
              ? 'bg-white text-pomegranate-600 shadow-md'
              : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.998 5.998 0 0 0-12 0m12 0c0-1.778-.912-3.346-2.288-4.303a3.5 3.5 0 0 0-4.42 0A4.498 4.498 0 0 0 6 18.72m12 0a9 9 0 0 1-18 0m12-11.25a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
          B2B Partners
        </button>
        <button
          onClick={() => setActiveTab('DOCUMENTATION')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'DOCUMENTATION'
              ? 'bg-white text-pomegranate-600 shadow-md'
              : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
          </svg>
          API Docs
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === 'ISSUANCE' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Al Etihad Reminder Banner */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 flex items-start gap-3 rounded-r-lg shadow-sm">
              <div className="text-blue-400 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-blue-800">Al Etihad Connectivity Note</p>
                <p className="text-xs text-blue-700 mt-1">
                  During development, all issuance requests are routed to <span className="underline font-mono">gestion@lovepomegranate.com</span>.
                </p>
              </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  Loading issuance requests...
                </div>
              ) : requests.length === 0 ? (
                <div className="p-12 text-center text-gray-500">No quote requests waiting for issuance.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase text-gray-500 font-bold tracking-wider">
                        <th className="px-6 py-4">Submitted</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Quote Details</th>
                        <th className="px-6 py-4">Premium</th>
                        <th className="px-6 py-4 text-center">Documentation Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {requests.map((req) => (
                        <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-mono text-gray-700">{req.quoteResult.referenceId}</div>
                            <div className="text-[10px] text-gray-400">{new Date(req.submittedAt).toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-bold text-gray-900">{req.customer.firstName} {req.customer.lastName}</div>
                            <div className="text-xs text-gray-500">{req.customer.email}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <span className="font-semibold text-pomegranate-600 text-xs">{req.quoteResult.schemeName}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            SAR {req.quoteResult.totalPremium.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => pdfService.generateCustomerPdf(req)}
                                  className="p-2 bg-gray-100 hover:bg-pomegranate-50 text-gray-600 hover:text-pomegranate-600 rounded-lg transition-all border border-gray-200 group relative"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                  </svg>
                                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Customer PDF</span>
                                </button>
                                <button
                                  onClick={() => pdfService.generateIssuancePdf(req)}
                                  className="p-2 bg-gray-100 hover:bg-slate-50 text-gray-600 hover:text-slate-800 rounded-lg transition-all border border-gray-200 group relative"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v14.25A2.25 2.25 0 0 0 5.25 19.5h13.5A2.25 2.25 0 0 0 21 17.25V6.75A2.25 2.25 0 0 0 18.75 4.5H5.25A2.25 2.25 0 0 0 3 6.75V19.5" />
                                  </svg>
                                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Issuance PDF</span>
                                </button>
                                <button
                                  onClick={() => handleSendEmail(req)}
                                  disabled={sendingEmail === req.id}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all border shadow-sm ${sendingEmail === req.id
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                                      : 'bg-pomegranate-600 hover:bg-pomegranate-700 text-white border-pomegranate-600 active:scale-95'
                                    }`}
                                >
                                  {sendingEmail === req.id ? 'Sending...' : 'Send Documents'}
                                </button>
                              </div>
                              {emailStatus && emailStatus.id === req.id && (
                                <div className={`text-[10px] text-center font-medium animate-fadeIn ${emailStatus.success ? 'text-green-600' : 'text-red-600'}`}>
                                  {emailStatus.message}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'PARTNERS' && <B2BManagement />}
        {activeTab === 'DOCUMENTATION' && <ApiDocumentation />}
      </div>
    </div>
  );
};