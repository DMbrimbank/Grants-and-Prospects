'use client';

import Link from "next/link";
import { useState } from "react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="container-app">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg"></div>
            <span className="font-bold text-lg text-gray-900">BTS Grants</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition text-sm font-medium">Dashboard</Link>
            <Link href="/grants" className="text-gray-700 hover:text-primary-600 transition text-sm font-medium">Grants</Link>
            <Link href="/prospecting" className="text-gray-700 hover:text-primary-600 transition text-sm font-medium">Prospecting</Link>
            <Link href="/generate-proposal" className="text-gray-700 hover:text-primary-600 transition text-sm font-medium">Generate Proposal</Link>
            <Link href="/contacts" className="text-gray-700 hover:text-primary-600 transition text-sm font-medium">Contacts</Link>
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block text-gray-700 hover:text-primary-600">Dashboard</Link>
            <Link href="/grants" className="block text-gray-700 hover:text-primary-600">Grants</Link>
            <Link href="/prospecting" className="block text-gray-700 hover:text-primary-600">Prospecting</Link>
            <Link href="/generate-proposal" className="block text-gray-700 hover:text-primary-600">Generate Proposal</Link>
            <Link href="/contacts" className="block text-gray-700 hover:text-primary-600">Contacts</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
