'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function GenerateProposalPage() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'grants' | 'prospecting'>('grants');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [grants, setGrants] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);

  const [grantForm, setGrantForm] = useState({
    selectedGrant: '',
    grantTitle: '',
    organization: '',
    programFocus: '',
    requestedAmount: '',
    targetOutcome: '',
  });

  const [prospectingForm, setProspectingForm] = useState({
    selectedCompany: '',
    companyName: '',
    sector: '',
    collaborationIdeas: '',
    contactName: '',
  });

  useEffect(() => {
    const urlMode = searchParams?.get('mode');
    if (urlMode === 'prospecting') setMode('prospecting');
    
    fetchGrants();
    fetchCompanies();
  }, []);

  const fetchGrants = async () => {
    try {
      const res = await fetch('/api/opportunities');
      if (res.ok) {
        const data = await res.json();
        setGrants(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching grants:', error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch('/api/companies');
      if (res.ok) {
        const data = await res.json();
        setCompanies(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const generateGrantProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/proposals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grantTitle: grantForm.grantTitle,
          organization: grantForm.organization,
          grantDescription: grantForm.grantTitle,
          btsProgram: grantForm.programFocus,
          requestedAmount: grantForm.requestedAmount,
          targetOutcome: grantForm.targetOutcome,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.proposal);
      } else {
        alert('Failed to generate proposal');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating proposal');
    } finally {
      setLoading(false);
    }
  };

  const generateProspectingEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/proposals/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: prospectingForm.companyName,
          sector: prospectingForm.sector,
          collaborationIdeas: prospectingForm.collaborationIdeas,
          contactName: prospectingForm.contactName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.email);
      } else {
        alert('Failed to generate email');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating email');
    } finally {
      setLoading(false);
    }
  };

  const exportToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      alert(mode === 'grants' ? 'Proposal copied!' : 'Email copied!');
    }
  };

  return (
    <div className="container-app py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Generate Proposal</h1>

      {/* Mode Selector */}
      <div className="mb-8 flex space-x-4">
        <button
          onClick={() => { setMode('grants'); setResult(''); }}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            mode === 'grants' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          💰 Grant Proposal
        </button>
        <button
          onClick={() => { setMode('prospecting'); setResult(''); }}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            mode === 'prospecting' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📧 Prospecting Email
        </button>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {mode === 'grants' ? 'Grant Proposal Details' : 'Company Details'}
          </h2>

          {mode === 'grants' ? (
            <form onSubmit={generateGrantProposal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Grant</label>
                <select
                  value={grantForm.selectedGrant}
                  onChange={(e) => {
                    const grant = grants.find(g => g.id === e.target.value);
                    if (grant) {
                      setGrantForm(prev => ({
                        ...prev,
                        selectedGrant: grant.id,
                        grantTitle: grant.title,
                        organization: grant.organization || '',
                      }));
                    }
                  }}
                  className="input-field"
                >
                  <option value="">Choose a grant...</option>
                  {grants.map(g => (
                    <option key={g.id} value={g.id}>{g.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">BTS Program Focus *</label>
                <input
                  type="text"
                  placeholder="e.g., AI Academy, Job Readiness"
                  value={grantForm.programFocus}
                  onChange={(e) => setGrantForm(prev => ({ ...prev, programFocus: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requested Amount *</label>
                <input
                  type="number"
                  placeholder="\,000"
                  value={grantForm.requestedAmount}
                  onChange={(e) => setGrantForm(prev => ({ ...prev, requestedAmount: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Outcome *</label>
                <textarea
                  placeholder="What do you want to achieve with this grant?"
                  value={grantForm.targetOutcome}
                  onChange={(e) => setGrantForm(prev => ({ ...prev, targetOutcome: e.target.value }))}
                  className="input-field"
                  rows={4}
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
                {loading ? 'Generating...' : 'Generate Proposal'}
              </button>
            </form>
          ) : (
            <form onSubmit={generateProspectingEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Company</label>
                <select
                  value={prospectingForm.selectedCompany}
                  onChange={(e) => {
                    const company = companies.find(c => c.id === e.target.value);
                    if (company) {
                      setProspectingForm(prev => ({
                        ...prev,
                        selectedCompany: company.id,
                        companyName: company.name,
                        sector: company.sector,
                      }));
                    }
                  }}
                  className="input-field"
                >
                  <option value="">Choose a company...</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ideas for Collaboration *</label>
                <textarea
                  placeholder="Sponsorship, mentorship, internships, innovation partnership?"
                  value={prospectingForm.collaborationIdeas}
                  onChange={(e) => setProspectingForm(prev => ({ ...prev, collaborationIdeas: e.target.value }))}
                  className="input-field"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                <input
                  type="text"
                  placeholder="John Smith"
                  value={prospectingForm.contactName}
                  onChange={(e) => setProspectingForm(prev => ({ ...prev, contactName: e.target.value }))}
                  className="input-field"
                />
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
                {loading ? 'Generating...' : 'Generate Email'}
              </button>
            </form>
          )}
        </div>

        {/* Result Section */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {mode === 'grants' ? 'Generated Proposal' : 'Generated Email'}
          </h2>

          {result ? (
            <div className="space-y-4">
              <textarea
                readOnly
                value={result}
                className="w-full bg-gray-50 p-4 rounded-lg border border-gray-200 h-96 font-sm resize-none"
              />
              <div className="flex space-x-3">
                <button onClick={exportToClipboard} className="flex-1 btn-primary">
                  📋 Copy to Clipboard
                </button>
                {mode === 'grants' && (
                  <button className="flex-1 btn-secondary">
                    📄 Export to Word
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500 text-center">
                Fill in the details and click generate to see the {mode === 'grants' ? 'proposal' : 'email'} here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
