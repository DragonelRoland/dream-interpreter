'use client'

import { useState, useEffect } from 'react'
import type { Noun, Association, InterpretationResult } from '../app/page'

type SymbolReplacementProps = {
  dreamText: string
  nouns: Noun[]
  onBack: () => void
  onNext: (updatedDream: string, associations: Association[], interpretation: InterpretationResult) => void
}

export default function SymbolReplacement({
  dreamText,
  nouns,
  onBack,
  onNext,
}: SymbolReplacementProps) {
  const [replacements, setReplacements] = useState<Record<string, string>>({})
  const [updatedText, setUpdatedText] = useState(dreamText)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize replacements with original tokens
    const initial: Record<string, string> = {}
    nouns.forEach((noun) => {
      initial[noun.token] = ''
    })
    setReplacements(initial)
  }, [nouns])

  const handleReplacementChange = (token: string, value: string) => {
    setReplacements((prev) => ({ ...prev, [token]: value }))
  }

  const handleUpdateDream = () => {
    let updated = dreamText
    const associations: Association[] = []

    // Sort nouns by start position in reverse to maintain correct positions during replacement
    const sortedNouns = [...nouns].sort(
      (a, b) => b.occurrences[0].start - a.occurrences[0].start
    )

    sortedNouns.forEach((noun) => {
      const replacement = replacements[noun.token]?.trim() || noun.token
      
      if (replacement !== noun.token) {
        associations.push({
          original: noun.token,
          replacement,
        })
      }

      // Replace all occurrences
      noun.occurrences.forEach((occ) => {
        updated =
          updated.slice(0, occ.start) +
          replacement +
          updated.slice(occ.end)
      })
    })

    setUpdatedText(updated)
  }

  const handleNext = async () => {
    setLoading(true)
    setError(null)

    try {
      const associations: Association[] = []
      nouns.forEach((noun) => {
        const replacement = replacements[noun.token]?.trim()
        if (replacement && replacement !== noun.token) {
          associations.push({
            original: noun.token,
            replacement,
          })
        }
      })

      const response = await fetch('/api/interpret-dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalDream: dreamText,
          updatedDream: updatedText,
          associations,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to interpret dream')
      }

      const data = await response.json()
      onNext(updatedText, associations, data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  const renderHighlightedText = () => {
    const parts: { text: string; isNoun: boolean }[] = []
    let lastIndex = 0

    // Create a flat list of all occurrences with their tokens
    const allOccurrences: Array<{ start: number; end: number; token: string }> = []
    nouns.forEach((noun) => {
      noun.occurrences.forEach((occ) => {
        allOccurrences.push({ ...occ, token: noun.token })
      })
    })

    // Sort by start position
    allOccurrences.sort((a, b) => a.start - b.start)

    allOccurrences.forEach((occ) => {
      // Add text before the noun
      if (occ.start > lastIndex) {
        parts.push({ text: dreamText.slice(lastIndex, occ.start), isNoun: false })
      }
      // Add the noun
      parts.push({ text: dreamText.slice(occ.start, occ.end), isNoun: true })
      lastIndex = occ.end
    })

    // Add remaining text
    if (lastIndex < dreamText.length) {
      parts.push({ text: dreamText.slice(lastIndex), isNoun: false })
    }

    return parts.map((part, index) => (
      <span
        key={index}
        className={part.isNoun ? 'bg-gray-700/50 underline decoration-gray-500' : ''}
      >
        {part.text}
      </span>
    ))
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Left Panel - Original Dream */}
      <div className="bg-card rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-4">Original Dream</h2>
        <div className="bg-background rounded-lg p-4 text-gray-300 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
          {renderHighlightedText()}
        </div>
        {updatedText !== dreamText && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-white mb-3">Updated Dream</h3>
            <div className="bg-background rounded-lg p-4 text-gray-300 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
              {updatedText}
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Symbol Replacement */}
      <div className="bg-card rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-4">Replace Symbols</h2>
        
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {nouns.map((noun) => (
            <div key={noun.token} className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                {noun.token}
              </label>
              <input
                type="text"
                value={replacements[noun.token] || ''}
                onChange={(e) => handleReplacementChange(noun.token, e.target.value)}
                placeholder="What do you associate with this?"
                className="w-full px-3 py-2 bg-background text-white rounded-lg border border-gray-700 focus:border-gray-500 focus:outline-none text-sm"
              />
              <p className="text-xs text-gray-500">
                Enter a word or person this symbol represents for you.
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleUpdateDream}
            className="w-full px-6 py-3 bg-cardHover border border-gray-600 text-gray-300 font-medium rounded-lg hover:bg-gray-700 hover:border-gray-500 transition-colors"
          >
            Update dream with new symbols
          </button>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={onBack}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-card border border-gray-600 text-gray-300 font-medium rounded-lg hover:bg-cardHover hover:border-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-white text-background font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Interpreting...' : 'Next: Interpretation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

