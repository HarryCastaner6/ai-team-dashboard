'use client'

import { useState, useEffect } from 'react'
import { Database, Copy, Check, ExternalLink, RefreshCw, Users, Zap } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export default function SupabaseSetup() {
  const [isConfigured, setIsConfigured] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  const [copied, setCopied] = useState('')
  const [testResult, setTestResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsConfigured(isSupabaseConfigured())
  }, [])

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  const testConnection = async () => {
    setIsLoading(true)
    setTestResult(null)
    
    try {
      if (!isSupabaseConfigured()) {
        setTestResult('Please add your Supabase credentials first')
        return
      }

      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1)

      if (error) {
        if (error.message.includes('relation "public.users" does not exist')) {
          setTestResult('⚠️ Connected but users table not found. Run the SQL setup below.')
        } else {
          setTestResult(`❌ Error: ${error.message}`)
        }
      } else {
        setTestResult('✅ Connected successfully! Ready for Claude collaboration.')
      }
    } catch (error) {
      setTestResult(`❌ Connection failed: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const sqlSetup = `-- Create users table for syncing team data
CREATE TABLE public.users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'USER',
  department text,
  position text,
  location text,
  overall_rating integer DEFAULT 70,
  skills jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create a policy for development (adjust for production)
CREATE POLICY "Allow all operations" ON public.users FOR ALL USING (true);

-- Enable real-time updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;`

  const envTemplate = `# Add these to your .env.local file:
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here`

  if (isConfigured && !showSetup) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="text-green-600" size={20} />
            <span className="text-green-800 font-semibold">Supabase Connected</span>
            <Zap className="text-green-600" size={16} />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={testConnection}
              disabled={isLoading}
              className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? <RefreshCw className="animate-spin" size={14} /> : <Database size={14} />}
              <span>Test</span>
            </button>
            <button
              onClick={() => setShowSetup(true)}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              Show Setup
            </button>
          </div>
        </div>
        {testResult && (
          <div className="mt-2 text-sm text-green-700">{testResult}</div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Database className="text-blue-600" size={24} />
        <h3 className="text-lg font-semibold text-blue-900">Supabase Setup for Claude Collaboration</h3>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-blue-800 mb-3">
            Set up Supabase to enable real-time debugging and collaboration with Claude. This allows me to:
          </p>
          <ul className="text-sm text-blue-700 space-y-1 ml-4">
            <li>• Monitor your database changes in real-time</li>
            <li>• Help debug issues with live data access</li>
            <li>• Sync and backup your team data</li>
            <li>• Provide better assistance with data-related problems</li>
          </ul>
        </div>

        {/* Step 1: Create Project */}
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
            <span>Create Supabase Project</span>
          </h4>
          <p className="text-sm text-gray-700 mb-3">
            Create a free account and new project at Supabase
          </p>
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <ExternalLink size={16} />
            <span>Open Supabase</span>
          </a>
        </div>

        {/* Step 2: Get Credentials */}
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
            <span>Get Your Credentials</span>
          </h4>
          <p className="text-sm text-gray-700 mb-3">
            In your Supabase project: <strong>Settings → API</strong>
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Copy these values:</label>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Project URL</strong> (looks like: https://abc123.supabase.co)</li>
                <li>• <strong>anon/public key</strong> (starts with: eyJhbGciOiJIUzI1NiIs...)</li>
                <li>• <strong>service_role key</strong> (for advanced features)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Step 3: Environment Variables */}
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
            <span>Add to .env.local</span>
          </h4>
          <p className="text-sm text-gray-700 mb-3">
            Replace the placeholder values in your <code className="bg-gray-100 px-1 rounded">.env.local</code> file:
          </p>
          <div className="bg-gray-100 rounded p-3 text-sm font-mono relative">
            <pre className="whitespace-pre-wrap">{envTemplate}</pre>
            <button
              onClick={() => copyToClipboard(envTemplate, 'env')}
              className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded"
              title="Copy template"
            >
              {copied === 'env' ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            📍 Your .env.local file is already set up with placeholders - just replace the URLs and keys!
          </p>
        </div>

        {/* Step 4: Database Setup */}
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
            <span>Create Database Tables</span>
          </h4>
          <p className="text-sm text-gray-700 mb-3">
            In Supabase: <strong>SQL Editor → New Query</strong> - paste and run this:
          </p>
          <div className="bg-gray-100 rounded p-3 text-sm font-mono relative max-h-40 overflow-y-auto">
            <pre className="whitespace-pre-wrap">{sqlSetup}</pre>
            <button
              onClick={() => copyToClipboard(sqlSetup, 'sql')}
              className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded"
              title="Copy SQL"
            >
              {copied === 'sql' ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* Step 5: Test Connection */}
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
            <span>Test & Sync</span>
          </h4>
          <p className="text-sm text-gray-700 mb-3">
            After adding credentials, restart your dev server and test the connection:
          </p>
          <div className="flex space-x-3">
            <button
              onClick={testConnection}
              disabled={isLoading || !isSupabaseConfigured()}
              className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? <RefreshCw className="animate-spin" size={16} /> : <Database size={16} />}
              <span>Test Connection</span>
            </button>
            <button
              onClick={() => setShowSetup(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Hide Setup
            </button>
          </div>
          {testResult && (
            <div className="mt-3 p-3 bg-gray-50 rounded text-sm">{testResult}</div>
          )}
        </div>

        {/* Claude Collaboration Info */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-purple-900 mb-2 flex items-center space-x-2">
            <Users className="text-purple-600" size={20} />
            <span>Claude Collaboration</span>
          </h4>
          <p className="text-sm text-purple-800">
            Once set up, you can share your Supabase project credentials with Claude for:
          </p>
          <ul className="text-sm text-purple-700 mt-2 space-y-1 ml-4">
            <li>• Real-time debugging sessions</li>
            <li>• Direct database query assistance</li>
            <li>• Data analysis and troubleshooting</li>
            <li>• Automated data migration and sync</li>
          </ul>
        </div>
      </div>
    </div>
  )
}