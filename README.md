# Dream App

A web application that helps users explore and interpret their dreams using AI-powered analysis.

## Features

- **Dream Input**: Enter or paste your dream transcription
- **Symbol Replacement**: Replace nouns with personal associations
- **AI Interpretation**: Get multiple perspectives on your dream including:
  - Inner parts narrative (raw and revised)
  - Core essence of the dream
  - Multiple interpretations
  - Optional poetic rendering

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- React 18
- TailwindCSS (dark mode only)
- OpenAI API (gpt-5-mini-2025-08-07)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dream-interpreter
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
OPENAI_API_KEY=your-openai-api-key-here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### 1. Enter Dream
Type or paste your dream transcription. A sample dream is available for testing.

### 2. Replace Symbols
The app extracts nouns from your dream and highlights them. You can replace each noun with what it personally represents to you.

### 3. Interpretation
Receive AI-generated interpretations including:
- **Inner Parts (Raw)**: Dream retold as inner parts of yourself
- **Inner Parts (Revised)**: Polished narrative version
- **Essence**: Core meaning of the dream
- **Interpretations**: 2-3 different perspectives
- **Poem**: Optional poetic rendering

## API Routes

### POST `/api/extract-nouns`
Extracts nouns from dream text using OpenAI.

**Request:**
```json
{
  "dreamText": "string"
}
```

**Response:**
```json
{
  "nouns": [
    {
      "token": "mountain",
      "occurrences": [{ "start": 12, "end": 20 }]
    }
  ]
}
```

### POST `/api/interpret-dream`
Generates dream interpretation using OpenAI.

**Request:**
```json
{
  "originalDream": "string",
  "updatedDream": "string",
  "associations": [
    { "original": "mountain", "replacement": "obstacle" }
  ]
}
```

**Response:**
```json
{
  "inner_parts_raw": "string",
  "inner_parts_revised": "string",
  "essence": "string",
  "interpretations": ["string"],
  "poem": "string"
}
```

## Design

The app uses a minimalist dark theme:
- Background: `#020617` (near-black)
- Cards: `#0f172a`
- Text: White and soft greys
- Clean typography with rounded corners and smooth transitions

## Building for Production

```bash
npm run build
npm start
```

## License

MIT
