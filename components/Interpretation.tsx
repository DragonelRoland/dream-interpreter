'use client'

import { useState } from 'react'
import type { InterpretationResult, Association } from '../app/page'

type InterpretationProps = {
  interpretation: InterpretationResult
  onBack: () => void
  originalDream: string
  updatedDream: string
  associations: Association[]
  onNewInterpretation: (interpretation: InterpretationResult) => void
}

export default function Interpretation({
  interpretation,
  onBack,
  originalDream,
  updatedDream,
  associations,
  onNewInterpretation,
}: InterpretationProps) {
  const [loading, setLoading] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleGenerateAnother = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/interpret-dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalDream,
          updatedDream,
          associations,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate new interpretation')
      }

      const data = await response.json()
      onNewInterpretation(data)
    } catch (err) {
      console.error('Error generating interpretation:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to symbols
      </button>

      {/* Inner Parts - Raw */}
      <InterpretationCard
        title="Inner Parts — Raw Dream"
        content={interpretation.inner_parts_raw}
        onCopy={handleCopy}
      />

      {/* Inner Parts - Revised */}
      <InterpretationCard
        title="Inner Parts — Revised"
        content={interpretation.inner_parts_revised}
        onCopy={handleCopy}
      />

      {/* Essence */}
      <InterpretationCard
        title="Essence of the Dream"
        content={interpretation.essence}
        onCopy={handleCopy}
      />

      {/* Interpretations */}
      <div className="bg-card rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Interpretations</h2>
          <button
            onClick={handleCopy.bind(null, interpretation.interpretations.join('\n\n'))}
            className="p-2 hover:bg-cardHover rounded-lg transition-colors"
            title="Copy all interpretations"
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          {interpretation.interpretations.map((interp, index) => (
            <div key={index} className="bg-background rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Interpretation {index + 1}
              </h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {interp}
              </p>
            </div>
          ))}
        </div>
        <button
          onClick={handleGenerateAnother}
          disabled={loading}
          className="mt-4 w-full px-6 py-3 bg-cardHover border border-gray-600 text-gray-300 font-medium rounded-lg hover:bg-gray-700 hover:border-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate another interpretation'}
        </button>
      </div>

      {/* Poem */}
      {interpretation.poem && (
        <InterpretationCard
          title="Poem"
          content={interpretation.poem}
          onCopy={handleCopy}
        />
      )}
    </div>
  )
}

type InterpretationCardProps = {
  title: string
  content: string
  onCopy: (text: string) => void
}

function InterpretationCard({ title, content, onCopy }: InterpretationCardProps) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <button
          onClick={() => onCopy(content)}
          className="p-2 hover:bg-cardHover rounded-lg transition-colors"
          title="Copy to clipboard"
        >
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>
      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  )
}

