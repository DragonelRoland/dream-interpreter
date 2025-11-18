import { NextResponse } from 'next/server'
import OpenAI from 'openai'

type Association = {
  original: string
  replacement: string
}

export async function POST(request: Request) {
  try {
    const { originalDream, updatedDream, associations } = await request.json()

    if (!originalDream || !updatedDream) {
      return NextResponse.json(
        { error: 'Dream texts are required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set')
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const systemPrompt = `You are an empathic dream interpreter with a psychologically grounded, gentle tone. Assume all figures and elements in the dream represent inner parts of the dreamer. Provide multiple perspectives without making absolute claims.`

    const associationsText = associations && associations.length > 0
      ? JSON.stringify(associations, null, 2)
      : 'None'

    const userPrompt = `Original dream: ${originalDream}

Dream with substituted symbols: ${updatedDream}

Associations (symbols): ${associationsText}

Please return ONLY JSON in the following format:

{
  "inner_parts_raw": "...",
  "inner_parts_revised": "...",
  "essence": "...",
  "interpretations": [
    "Interpretation 1...",
    "Interpretation 2..."
  ],
  "poem": "..."
}

Requirements:

1. "inner_parts_raw": Retell the dream from the perspective of inner parts ("A part of me…"). Keep it conversational and unpolished.
2. "inner_parts_revised": Rewrite this into a smooth, clear narrative with better flow and structure.
3. "essence": Summarize the core meaning of the dream in 2-4 sentences.
4. "interpretations": Provide 2-3 emotionally intelligent interpretations, each exploring a different angle or possibility.
5. "poem": Write a short poem (4-8 lines) based on the dream's emotional landscape and symbolism.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-5-mini-2025-08-07',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    })

    const result = completion.choices[0].message.content
    if (!result) {
      throw new Error('No response from OpenAI')
    }

    const parsed = JSON.parse(result)
    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Error interpreting dream:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to interpret dream', details: errorMessage },
      { status: 500 }
    )
  }
}

