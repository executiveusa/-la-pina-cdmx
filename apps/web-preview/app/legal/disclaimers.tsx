'use client'

import { useState } from 'react'

interface EmergencyResource {
  name: string
  phone: string
  available: string
}

interface EmergencyResources {
  us: {
    suicide: EmergencyResource
    crisis: EmergencyResource
    domesticViolence: EmergencyResource
  }
  mx: {
    suicide: EmergencyResource
    domesticViolence: EmergencyResource
  }
}

export function MedicalDisclaimer({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-semibold text-yellow-800">Not Medical Advice</h3>
          <p className="mt-1 text-sm text-yellow-700">
            La Piña is an educational and wellness tracking tool. It is <strong>NOT</strong> a
            substitute for professional medical advice, diagnosis, or treatment. Always seek the
            advice of your physician or other qualified health provider with any questions you may
            have regarding a medical condition.
          </p>
        </div>
      </div>
    </div>
  )
}

export function EmergencyBanner({ className = '' }: { className?: string }) {
  const [showResources, setShowResources] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<'us' | 'mx'>('us')

  const resources: EmergencyResources = {
    us: {
      suicide: {
        name: 'National Suicide Prevention Lifeline',
        phone: '988',
        available: '24/7',
      },
      crisis: {
        name: 'Crisis Text Line',
        phone: 'Text HOME to 741741',
        available: '24/7',
      },
      domesticViolence: {
        name: 'National Domestic Violence Hotline',
        phone: '1-800-799-7233',
        available: '24/7',
      },
    },
    mx: {
      suicide: {
        name: 'SAPTEL',
        phone: '55 5259-8121',
        available: '24/7',
      },
      domesticViolence: {
        name: 'Línea Nacional contra la Violencia',
        phone: '911 or 800-108-4053',
        available: '24/7',
      },
    },
  }

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 7a1 1 0 012 0v4a1 1 0 11-2 0V7zm1 8a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-semibold text-red-800">
              If you're experiencing a medical emergency
            </h3>
            <p className="mt-1 text-sm text-red-700">
              Call 911 (US) or your local emergency number immediately. Don't wait.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowResources(!showResources)}
          className="ml-3 text-sm font-medium text-red-700 hover:text-red-800 underline"
        >
          {showResources ? 'Hide' : 'Show'} Resources
        </button>
      </div>

      {showResources && (
        <div className="mt-4 pt-4 border-t border-red-200">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSelectedCountry('us')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCountry === 'us'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-red-700 border border-red-300'
              }`}
            >
              United States
            </button>
            <button
              onClick={() => setSelectedCountry('mx')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCountry === 'mx'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-red-700 border border-red-300'
              }`}
            >
              Mexico
            </button>
          </div>

          <div className="space-y-3">
            {Object.entries(resources[selectedCountry]).map(([key, resource]) => (
              <div key={key} className="bg-white rounded-lg p-3 border border-red-200">
                <div className="font-semibold text-sm text-neutral-900">{resource.name}</div>
                <a
                  href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`}
                  className="text-red-700 font-bold text-base hover:underline"
                >
                  {resource.phone}
                </a>
                <div className="text-xs text-neutral-600 mt-1">{resource.available}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function WhenToSeeDoctorCard({ className = '' }: { className?: string }) {
  const urgentSymptoms = [
    'Severe abdominal pain or cramping',
    'Unusually heavy bleeding (soaking through a pad in less than 1 hour)',
    'Signs of infection (fever over 100.4°F, foul-smelling discharge)',
    'Sudden severe headache or vision changes',
    'Chest pain or difficulty breathing',
    'Signs of ectopic pregnancy or miscarriage',
    'Severe mood changes or thoughts of self-harm',
  ]

  return (
    <div className={`bg-purple-50 border border-purple-200 rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-purple-900 mb-3">When to See a Doctor</h3>
      <p className="text-sm text-purple-800 mb-3">
        Seek immediate medical attention if you experience:
      </p>
      <ul className="space-y-2">
        {urgentSymptoms.map((symptom, index) => (
          <li key={index} className="flex items-start text-sm text-purple-900">
            <svg
              className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {symptom}
          </li>
        ))}
      </ul>
      <p className="text-xs text-purple-700 mt-4 italic">
        This is not an exhaustive list. Trust your instincts - if something doesn't feel right,
        contact your healthcare provider.
      </p>
    </div>
  )
}

export function AffiliateDisclosure({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-3 ${className}`}>
      <p className="text-xs text-blue-900">
        <strong>Affiliate Disclosure:</strong> Some links on this page are affiliate links, which
        means we may earn a small commission if you make a purchase through them. This comes at no
        additional cost to you and helps us keep La Piña free and accessible. We only recommend
        products we genuinely believe in.
      </p>
    </div>
  )
}
