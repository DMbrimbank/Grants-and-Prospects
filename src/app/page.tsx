'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OpportunitySummary {
  total: number;
  active: number;
  totalFunding: number;
  conversionRate: number;
}

export default function Dashboard() {
  const [summary, setSummary] = useState<OpportunitySummary>({
    total: 0,
    active: 0,
    totalFunding: 0,
    conversionRate: 0,
  });

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/opportunities/summary');
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    }
  };

  const statusData = [
    { name: 'Not Contacted', value: 24, fill: '#d1d5db' },
    { name: 'Researching', value: 12, fill: '#fbbf24' },
    { name: 'Prepared', value: 8, fill: '#60a5fa' },
    { name: 'Applied', value: 15, fill: '#34d399' },
    { name: 'Active', value: 5, fill: '#10b981' },
  ];

  const fundingData = [
    { month: 'Jan', amount: 50000 },
    { month: 'Feb', amount: 120000 },
    { month: 'Mar', amount: 95000 },
    { month: 'Apr', amount: 180000 },
    { month: 'May', amount: 220000 },
    { month: 'Jun', amount: 150000 },
  ];

  return (
    <div className="container-app py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Grants & Partnerships Dashboard</h1>
        <p className="text-gray-600">Track opportunities, manage contacts, and secure funding for BTS programs</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Total Opportunities</p>
          <p className="text-3xl font-bold text-gray-900">{summary.total}</p>
          <p className="text-xs text-gray-500 mt-2">Grants & partnerships</p>
        </div>

        <div className="card border-l-4 border-primary-600">
          <p className="text-sm text-gray-600 mb-1">Active Opportunities</p>
          <p className="text-3xl font-bold text-primary-600">{summary.active}</p>
          <p className="text-xs text-gray-500 mt-2">In active pursuit</p>
        </div>

        <div className="card border-l-4 border-success-600">
          <p className="text-sm text-gray-600 mb-1">Total Potential Funding</p>
          <p className="text-3xl font-bold text-success-600">${(summary.totalFunding / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-gray-500 mt-2">If all applied</p>
        </div>

        <div className="card border-l-4 border-warning-600">
          <p className="text-sm text-gray-600 mb-1">Estimated Conversion</p>
          <p className="text-3xl font-bold text-warning-600">{summary.conversionRate}%</p>
          <p className="text-xs text-gray-500 mt-2">Historical success rate</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link href="/opportunities/new" className="card hover:shadow-md transition group">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition">Add Opportunity</h3>
          <p className="text-sm text-gray-600 mt-1">Create a new grant or partnership lead</p>
        </Link>

        <Link href="/generate-proposal" className="card hover:shadow-md transition group">
          <div className="text-4xl mb-4">✨</div>
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition">Generate Proposal</h3>
          <p className="text-sm text-gray-600 mt-1">AI-powered grant proposal creation</p>
        </Link>

        <Link href="/contacts" className="card hover:shadow-md transition group">
          <div className="text-4xl mb-4">📞</div>
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition">Manage Contacts</h3>
          <p className="text-sm text-gray-600 mt-1">Track outreach and follow-ups</p>
        </Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-6">Opportunity Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 space-y-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.fill }}></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-6">Funding Trajectory</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fundingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
              <Bar dataKey="amount" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
