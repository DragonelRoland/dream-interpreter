'use client'

import { useState } from 'react'
import type { Noun } from '../app/page'

type DreamInputProps = {
  dreamText: string
  setDreamText: (text: string) => void
  onNext: (text: string, nouns: Noun[]) => void
}

const SAMPLE_DREAM = "I was climbing a steep mountain with my brother. The path was narrow and dangerous. At the summit, I found a golden door that led to a garden filled with butterflies and singing birds. My mother was there, waiting for me with a warm smile."

export default function DreamInput({ dreamText, setDreamText, onNext }: DreamInputProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleNext = async () => {
    if (!dreamText.trim()) {
      setError('Please enter your dream text')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/extract-nouns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dreamText }),
      })

      if (!response.ok) {
        throw new Error('Failed to extract nouns')
      }

      const data = await response.json()
      onNext(dreamText, data.nouns)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleLoadSample = () => {
    setDreamText(SAMPLE_DREAM)
    setError(null)
  }

  return (
    <div className="bg-card rounded-2xl p-8 shadow-xl transition-all duration-200">
      <h2 className="text-2xl font-semibold text-white mb-6">Enter your dream</h2>

      <textarea
        value={dreamText}
        onChange={(e) => setDreamText(e.target.value)}
        placeholder="Paste or type the transcription of your dream…"
        className="w-full h-64 px-4 py-3 bg-background text-white rounded-lg border border-gray-700 focus:border-gray-500 focus:outline-none resize-none"
        disabled={loading}
      />

      {error && (
        <p className="mt-4 text-red-400 text-sm">{error}</p>
      )}

      <div className="mt-6 flex gap-4">
        <button
          onClick={handleNext}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-white text-background font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Next: Identify symbols'}
        </button>
        <button
          onClick={handleLoadSample}
          disabled={loading}
          className="px-6 py-3 bg-card border border-gray-600 text-gray-300 font-medium rounded-lg hover:bg-cardHover hover:border-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Load sample dream
        </button>
      </div>
    </div>
  )
}

