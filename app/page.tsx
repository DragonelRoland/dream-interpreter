'use client'

import { useState } from 'react'
import Stepper from '../components/Stepper'
import DreamInput from '../components/DreamInput'
import SymbolReplacement from '../components/SymbolReplacement'
import Interpretation from '../components/Interpretation'

export type Noun = {
  token: string
  occurrences: Array<{ start: number; end: number }>
}

export type Association = {
  original: string
  replacement: string
}

export type InterpretationResult = {
  inner_parts_raw: string
  inner_parts_revised: string
  essence: string
  interpretations: string[]
  poem?: string
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [dreamText, setDreamText] = useState('')
  const [nouns, setNouns] = useState<Noun[]>([])
  const [updatedDream, setUpdatedDream] = useState('')
  const [associations, setAssociations] = useState<Association[]>([])
  const [interpretation, setInterpretation] = useState<InterpretationResult | null>(null)

  const steps = ['Enter Dream', 'Replace Symbols', 'Interpretation']

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Dream App</h1>
          <p className="text-gray-400">Explore and interpret your dreams</p>
        </header>

        <Stepper steps={steps} currentStep={currentStep} />

        <div className="mt-8">
          {currentStep === 1 && (
            <DreamInput
              dreamText={dreamText}
              setDreamText={setDreamText}
              onNext={(text: string, extractedNouns: Noun[]) => {
                setDreamText(text)
                setNouns(extractedNouns)
                setCurrentStep(2)
              }}
            />
          )}

          {currentStep === 2 && (
            <SymbolReplacement
              dreamText={dreamText}
              nouns={nouns}
              onBack={() => setCurrentStep(1)}
              onNext={(updated: string, assocs: Association[], interp: InterpretationResult) => {
                setUpdatedDream(updated)
                setAssociations(assocs)
                setInterpretation(interp)
                setCurrentStep(3)
              }}
            />
          )}

          {currentStep === 3 && interpretation && (
            <Interpretation
              interpretation={interpretation}
              onBack={() => setCurrentStep(2)}
              originalDream={dreamText}
              updatedDream={updatedDream}
              associations={associations}
              onNewInterpretation={(newInterp) => setInterpretation(newInterp)}
            />
          )}

          {currentStep === 3 && !interpretation && (
            <div className="text-center py-8">
              <p className="text-gray-400">Loading interpretation...</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

