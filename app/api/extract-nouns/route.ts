import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: Request) {
  try {
    const { dreamText } = await request.json()

    if (!dreamText || typeof dreamText !== 'string') {
      return NextResponse.json(
        { error: 'Dream text is required' },
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

    const systemPrompt = 'You are a helpful NLP tool. Extract all nouns from the dream text. Return structured JSON only.'

    const userPrompt = `Text: ${dreamText}

Tasks:

1. Identify every noun in the text.
2. Deduplicate identical nouns.
3. Return JSON exactly in this format:

{
  "nouns": [
    {
      "token": "mountain",
      "occurrences": [
        { "start": 12, "end": 20 }
      ]
    }
  ]
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-5-mini-2025-08-07',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const result = completion.choices[0].message.content
    if (!result) {
      throw new Error('No response from OpenAI')
    }

    const parsed = JSON.parse(result)
    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Error extracting nouns:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to extract nouns', details: errorMessage },
      { status: 500 }
    )
  }
}

