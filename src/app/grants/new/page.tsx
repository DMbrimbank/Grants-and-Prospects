'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewOpportunityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'grant',
    title: '',
    description: '',
    organization: '',
    sector: '',
    stream: '',
    fundingAmount: '',
    applicationDeadline: '',
    fitScore: 50,
    url: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/opportunities');
      } else {
        alert('Failed to create opportunity');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating opportunity');
    } finally {
      setLoading(false);
    }
  };

  const streams = [
    'Future of Communication',
    'Future of Sustainability',
    'Future of Health',
    'Future of Intelligence',
  ];

  return (
    <div className="container-app py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Opportunity</h1>
        <p className="text-gray-600 mb-8">Create a new grant or partnership opportunity</p>

        <form onSubmit={handleSubmit} className="space-y-6 card">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="input-field"
            >
              <option value="grant">Grant</option>
              <option value="partnership">Partnership</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Victorian Innovation Grant 2026"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Organization *</label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Department of Education"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field resize-none"
              rows={4}
              placeholder="Grant or partnership details..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
              <input
                type="text"
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Technology, Education"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stream</label>
              <select
                name="stream"
                value={formData.stream}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select Stream</option>
                {streams.map(stream => (
                  <option key={stream} value={stream}>{stream}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Funding Amount ($)</label>
              <input
                type="number"
                name="fundingAmount"
                value={formData.fundingAmount}
                onChange={handleChange}
                className="input-field"
                placeholder="250000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
              <input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fit Score (0-100)</label>
            <input
              type="range"
              name="fitScore"
              value={formData.fitScore}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">Current: {formData.fitScore}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website/Link</label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="input-field"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="input-field resize-none"
              rows={3}
              placeholder="Any additional notes..."
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Opportunity'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
