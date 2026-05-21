'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Company {
  id: string;
  name: string;
  industry: string;
  sector: string;
  location: string;
  email?: string;
  website?: string;
  csrFocus?: string;
  fundingCapacity: string;
  tier: number;
  btsPrograms?: string;
  size?: string;
}

interface PartnershipIdea {
  ideaName: string;
  whyAligned: string;
  streams: string[];
  programs: string[];
  estimatedBudget: string;
  studentImpactNumber: number;
  studentImpactDescription: string;
  difficulty: string;
  firstContactAngle: string;
}

const EMAIL_TEMPLATES: Record<string, string> = {
  'Technology': `Hi [NAME],

I hope this email finds you well. I'm reaching out from Brimbank Tech School (BTS), a Victorian tech education initiative.

Your work in technology aligns perfectly with our AI Academy program. We're exploring partnerships for mentorship, internships, and innovation programs.

Would you be available for a brief call to discuss potential collaboration?

Best regards,
Brimbank Tech School`,

  'Automotive': `Hi [NAME],

I hope this email finds you well. I'm reaching out from Brimbank Tech School (BTS).

Your commitment to sustainable mobility aligns with our Sustainability Programs. We'd like to explore partnerships for engineering career pathways and sustainability initiatives.

Would you be open to discussing this further?

Best regards,
Brimbank Tech School`,

  'default': `Hi [NAME],

I hope this email finds you well. I'm reaching out from Brimbank Tech School (BTS).

We believe [COMPANY]'s values align with our mission. We're exploring strategic partnerships for student mentorship, career pathways, and innovation programs.

Would you like to discuss potential collaboration?

Best regards,
Brimbank Tech School`
};

export default function ProspectingPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [sectorFilter, setSectorFilter] = useState('');
  const [tierFilter, setTierFilter] = useState<number | null>(null);
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [ideas, setIdeas] = useState<Record<string, PartnershipIdea[]>>({});
  const [showIdeas, setShowIdeas] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchCompanies();
  }, [sectorFilter, tierFilter]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (sectorFilter) params.append('sector', sectorFilter);
      if (tierFilter) params.append('tier', tierFilter.toString());
      const url = params.toString() ? `/api/companies?${params.toString()}` : '/api/companies';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setCompanies(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateIdeas = async (company: Company) => {
    setIdeasLoading(true);
    try {
      const res = await fetch(`/api/companies/${company.id}/generate-ideas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company }),
      });

      if (res.ok) {
        const data = await res.json();
        setIdeas(prev => ({
          ...prev,
          [company.id]: data.ideas || []
        }));
        setShowIdeas(prev => ({
          ...prev,
          [company.id]: true
        }));
      } else {
        alert('Failed to generate ideas');
      }
    } catch (error) {
      console.error('Error generating ideas:', error);
      alert('Error generating partnership ideas');
    } finally {
      setIdeasLoading(false);
    }
  };

  const getSectorColor = (sector: string) => {
    const colors: Record<string, string> = {
      'Technology': 'bg-blue-100 text-blue-800',
      'Automotive': 'bg-purple-100 text-purple-800',
      'Energy': 'bg-green-100 text-green-800',
      'Finance': 'bg-gray-100 text-gray-800',
      'Healthcare': 'bg-red-100 text-red-800',
    };
    return colors[sector] || 'bg-gray-100 text-gray-800';
  };

  const getTierLabel = (tier: number) => {
    const labels: Record<number, string> = {
      1: 'Tier 1 - Top 50',
      2: 'Tier 2 - ASX 51-150',
      3: 'Tier 3 - ASX 151-300',
      4: 'Tier 4 - Regional/SME',
    };
    return labels[tier] || 'Unknown';
  };

  const getTierColor = (tier: number) => {
    const colors: Record<number, string> = {
      1: 'bg-amber-100 text-amber-800',
      2: 'bg-blue-100 text-blue-800',
      3: 'bg-green-100 text-green-800',
      4: 'bg-gray-100 text-gray-800',
    };
    return colors[tier] || 'bg-gray-100 text-gray-800';
  };

  const parseBtsPrograms = (btsPrograms?: string): string[] => {
    if (!btsPrograms) return [];
    try {
      return JSON.parse(btsPrograms);
    } catch {
      return [];
    }
  };

  const getTemplate = (sector: string) => {
    return EMAIL_TEMPLATES[sector] || EMAIL_TEMPLATES['default'];
  };

  return (
    <div className="container-app py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Prospecting</h1>
        <p className="text-gray-600">Strategic partnerships with major organizations</p>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter by Sector</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSectorFilter('')}
            className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
              !sectorFilter ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Sectors
          </button>
          {['Technology', 'Automotive', 'Energy', 'Finance', 'Healthcare'].map(sector => (
            <button
              key={sector}
              onClick={() => setSectorFilter(sector)}
              className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
                sectorFilter === sector ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter by Business Tier</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTierFilter(null)}
            className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
              !tierFilter ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Tiers
          </button>
          {[1, 2, 3, 4].map(tier => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
                tierFilter === tier ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {getTierLabel(tier)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading && <div className="text-center py-12"><p className="text-gray-500">Loading companies...</p></div>}
        {!loading && companies.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-gray-500">No companies found. Add your first prospect!</p>
            <Link href="/prospecting/add" className="btn-primary inline-block mt-4">+ Add Company</Link>
          </div>
        )}
        {companies.map((company) => (
          <div key={company.id} className="card hover:shadow-md transition cursor-pointer" onClick={() => setSelectedCompany(selectedCompany === company.id ? null : company.id)}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{company.name}</h3>
                <div className="flex items-center space-x-3 flex-wrap gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSectorColor(company.sector)}`}>{company.sector}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(company.tier)}`}>{getTierLabel(company.tier)}</span>
                  <span className="text-sm text-gray-600">{company.industry}</span>
                </div>
              </div>
              <svg className={`w-5 h-5 text-primary-600 transition ${selectedCompany === company.id ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>

            {selectedCompany === company.id && (
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">📍 Location</h4>
                  <p className="text-sm text-gray-700">{company.location}</p>
                </div>

                {company.email && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">📧 Email</h4>
                    <p className="text-sm text-gray-700 font-mono bg-gray-50 p-2 rounded">{company.email}</p>
                  </div>
                )}

                {parseBtsPrograms(company.btsPrograms).length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">🎯 Aligned BTS Programs</h4>
                    <div className="flex flex-wrap gap-2">
                      {parseBtsPrograms(company.btsPrograms).map(program => (
                        <span key={program} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
                          {program}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {company.csrFocus && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">💼 CSR Focus</h4>
                    <p className="text-sm text-gray-700">{company.csrFocus}</p>
                  </div>
                )}

                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!ideas[company.id]) {
                        generateIdeas(company);
                      } else {
                        setShowIdeas(prev => ({
                          ...prev,
                          [company.id]: !prev[company.id]
                        }));
                      }
                    }}
                    disabled={ideasLoading}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50"
                  >
                    {ideasLoading ? '✨ Generating ideas...' : (ideas[company.id]?.length ? `💡 Show Partnership Ideas (${ideas[company.id].length})` : '💡 Generate Partnership Ideas')}
                  </button>
                </div>

                {showIdeas[company.id] && ideas[company.id]?.length > 0 && (
                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-900">🎯 AI-Generated Partnership Ideas</h4>
                    {ideas[company.id].map((idea, idx) => (
                      <div key={idx} className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-xs">
                        <h5 className="font-semibold text-purple-900 mb-2">{idea.ideaName}</h5>
                        <p className="text-purple-800 mb-2"><strong>Why aligned:</strong> {idea.whyAligned}</p>
                        <div className="grid grid-cols-2 gap-2 text-purple-700 mb-2">
                          <div><strong>Budget:</strong> {idea.estimatedBudget}</div>
                          <div><strong>Students:</strong> {idea.studentImpactNumber}</div>
                          <div><strong>Difficulty:</strong> {idea.difficulty}</div>
                          <div><strong>Impact:</strong> {idea.studentImpactDescription}</div>
                        </div>
                        <p className="text-purple-700 mb-2"><strong>Pitch angle:</strong> "{idea.firstContactAngle}"</p>
                        {idea.streams?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {idea.streams.map(stream => (
                              <span key={stream} className="bg-purple-200 text-purple-900 px-2 py-1 rounded text-xs">
                                {stream}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">✉️ Email Draft</h4>
                  <textarea
                    readOnly
                    className="w-full bg-gray-50 p-4 rounded-lg text-xs border border-gray-200 h-40"
                    value={getTemplate(company.sector).replace('[NAME]', 'there').replace('[COMPANY]', company.name)}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const template = getTemplate(company.sector);
                      navigator.clipboard.writeText(template);
                      alert('Email template copied!');
                    }}
                    className="mt-2 px-4 py-2 bg-primary-600 text-white rounded text-sm hover:bg-primary-700"
                  >
                    Copy Template
                  </button>
                </div>

                <div className="flex space-x-3">
                  <Link href={`/generate-proposal?mode=prospecting&company=${company.name}`} className="flex-1 btn-primary text-center text-sm">
                    Generate Email
                  </Link>
                  <button className="flex-1 btn-secondary text-sm">Log Contact</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
