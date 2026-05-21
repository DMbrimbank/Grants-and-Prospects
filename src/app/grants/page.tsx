'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Opportunity {
  id: string;
  title: string;
  organization?: string;
  fundingAmount?: number;
  applicationDeadline?: string;
  fitScore: number;
  status: string;
  type: string;
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [discoveringGrants, setDiscoveringGrants] = useState(false);

  useEffect(() => {
    fetchOpportunities();
  }, [filter]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const url = filter === 'all'
        ? '/api/opportunities'
        : `/api/opportunities?status=${filter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOpportunities(Array.isArray(data) ? data : []);
        setError('');
      } else {
        setError('Failed to load opportunities');
      }
    } catch (error) {
      console.error('Failed to fetch opportunities:', error);
      setError('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const discoverAndMatchGrants = async () => {
    setDiscoveringGrants(true);
    try {
      const res = await fetch('/api/admin/daily-grants-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        const data = await res.json();
        alert(`✅ Discovered ${data.discovered} new grants!\n${data.topOpportunities} with fit score > 70 ready for submission`);
        // Refresh list
        fetchOpportunities();
      } else {
        alert('Failed to discover grants');
      }
    } catch (error) {
      console.error('Error discovering grants:', error);
      alert('Error discovering grants');
    } finally {
      setDiscoveringGrants(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'not_contacted': 'bg-gray-100 text-gray-800',
      'researching': 'bg-yellow-100 text-yellow-800',
      'prepared': 'bg-blue-100 text-blue-800',
      'applied': 'bg-green-100 text-green-800',
      'active_conversation': 'bg-purple-100 text-purple-800',
      'partnership': 'bg-emerald-100 text-emerald-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    return type === 'grant' ? '💰' : '🤝';
  };

  return (
    <div className="container-app py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Opportunities</h1>
          <p className="text-gray-600 mt-1">{opportunities.length} grants & partnerships</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={discoverAndMatchGrants}
            disabled={discoveringGrants}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium text-sm"
          >
            {discoveringGrants ? '🔄 Discovering...' : '🌍 Discover Grants'}
          </button>
          <Link href="/opportunities/new" className="btn-primary">
            + New Opportunity
          </Link>
        </div>
      </div>

      <div className="flex space-x-4 mb-8 overflow-x-auto">
        {['all', 'not_contacted', 'researching', 'prepared', 'applied'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            {status === 'all' ? 'All' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {error && <div className="card bg-red-50 text-red-700 border border-red-200">{error}</div>}
        {loading ? (
          <div className="text-center py-12"><p className="text-gray-500">Loading...</p></div>
        ) : opportunities.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 mb-4">No opportunities found</p>
            <Link href="/opportunities/new" className="btn-primary inline-block">
              Create Your First Opportunity
            </Link>
          </div>
        ) : (
          opportunities.map((opp) => (
            <div key={opp.id} className="card hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{getTypeIcon(opp.type)}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{opp.title}</h3>
                  </div>
                  {opp.organization && <p className="text-sm text-gray-600">{opp.organization}</p>}
                  <div className="flex items-center space-x-4 mt-3">
                    {opp.fundingAmount && (
                      <span className="text-sm font-semibold text-primary-600">
                        ${(opp.fundingAmount / 1000).toFixed(0)}k
                      </span>
                    )}
                    {opp.applicationDeadline && (
                      <span className="text-sm text-gray-500">
                        Deadline: {new Date(opp.applicationDeadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-3xl font-bold text-primary-600 mb-2">{opp.fitScore}</div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(opp.status)}`}>
                    {opp.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
