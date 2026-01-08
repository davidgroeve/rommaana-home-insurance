import React, { useEffect, useState } from 'react';
import { User, Policy } from '../types';
import { rommaanaApi } from '../services/api'; // Updated import

interface DashboardProps {
  user: User;
  onShopNew: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onShopNew }) => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPolicies = async () => {
      setLoading(true);
      // Use centralized API
      const data = await rommaanaApi.policies.list(user.id);
      setPolicies(data);
      setLoading(false);
  }

  useEffect(() => {
    fetchPolicies();
  }, [user.id]);

  const handleRenew = async (policyId: string) => {
      // Use centralized API
      await rommaanaApi.policies.renew(policyId);
      fetchPolicies();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-pomegranate-900">My Policies</h1>
          <p className="text-gray-500 mt-1">Manage your home insurance portfolio</p>
        </div>
        <button 
            onClick={onShopNew}
            className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Buy New Policy
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-64 animate-pulse">
                     <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                     <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                     <div className="h-4 bg-gray-200 rounded w-full mb-8"></div>
                </div>
            ))}
        </div>
      ) : policies.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-pomegranate-50 text-pomegranate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No active policies found</h3>
            <p className="text-gray-500 mt-2 mb-6">You haven't purchased any insurance policies yet.</p>
            <button onClick={onShopNew} className="text-pomegranate-600 font-semibold hover:underline">Get a quote now</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {policies.map((policy) => (
            <div key={policy.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row">
                <div className={`md:w-2 bg-gradient-to-b ${policy.status === 'ACTIVE' ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'}`}></div>
                
                <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="font-mono text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                    {policy.policyNumber}
                                </span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${policy.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                    {policy.status}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-pomegranate-900">
                                {policy.request.userType === 'OWNER' ? 'Homeowner' : 'Tenant'} Policy
                            </h3>
                            <p className="text-sm text-gray-500">{policy.quoteResult?.schemeName || 'Standard Plan'}</p>
                        </div>
                        <div className="text-left md:text-right">
                             <p className="text-sm text-gray-500">Premium Paid</p>
                             <p className="text-2xl font-bold text-pomegranate-800">SAR {policy.premium.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 border-t border-gray-100 pt-6">
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Effective Date</p>
                            <p className="text-sm font-medium text-gray-700">{new Date(policy.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Expiration Date</p>
                            <p className="text-sm font-medium text-gray-700">{new Date(policy.endDate).toLocaleDateString()}</p>
                        </div>
                        <div className="md:col-span-2">
                             <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Coverage Highlights</p>
                             <div className="flex flex-wrap gap-2">
                                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                    Building: {policy.quoteResult?.limits?.building?.toLocaleString() ?? 0} SAR
                                </span>
                                <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                    Contents: {policy.quoteResult?.limits?.contents?.toLocaleString() ?? 0} SAR
                                </span>
                                {policy.request.selectedOptions.length > 0 && (
                                    <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
                                        + {policy.request.selectedOptions.length} Extras
                                    </span>
                                )}
                             </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 p-6 flex flex-col justify-center gap-3 md:w-48">
                    <button className="w-full bg-white border border-gray-300 hover:bg-pomegranate-50 text-pomegranate-700 font-medium py-2 rounded-lg text-sm transition-colors">
                        Modify Policy
                    </button>
                     <button 
                        onClick={() => handleRenew(policy.id)}
                        className="w-full bg-pomegranate-600 hover:bg-pomegranate-700 text-white font-medium py-2 rounded-lg text-sm transition-colors shadow-sm"
                    >
                        Renew Policy
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};