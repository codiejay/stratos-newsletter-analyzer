## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── analyze/       # Newsletter analysis endpoint
│   │       └── index.tsx
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── assets/                # Static assets
│   └── icons/            # SVG icons as React components
├── components/            # React components
│   ├── common/           # Shared components
│   │   └── LoadingSpinner.tsx
│   ├── Input/            # Input-related components
│   │   └── EmailHTMLInput/   # Main email input component
│   │       ├── components/   # Sub-components
│   │       │   ├── InputSection.tsx
│   │       │   ├── Tag.tsx
│   │       │   └── ResultDisplay/
│   │       └── index.tsx
│   └── MatrixRain.tsx    # Matrix rain animation
└── lib/                  # Utility functions and services
    ├── env.ts            # Environment configuration
    ├── parser.ts         # HTML parsing utilities
    └── services/         # External service integrations
        └── openai.ts     # OpenAI service
```

### Architecture

1. **EmailHTMLInput**

   - Main container component
   - Manages state and API interactions
   - Coordinates sub-components

2. **InputSection**

   - Handles user input
   - Manages input validation
   - Controls submission process

3. **ResultDisplay**

   - Renders analysis results
   - Composed of specialized sections:
     - TagsSection
     - SummarySection
     - MetadataSection
     - RawTextSection

4. **Common Components**
   - LoadingSpinner
   - Tag
   - ArrowIcon

### Data Flow

1. User inputs HTML content
2. Content is sent to `/api/analyze` endpoint
3. Server processes HTML:
   - Extracts text using HTMLParser
   - Sends to OpenAI for analysis
4. Results are displayed in organized sections

## API Response Format

```typescript
interface AnalysisResponse {
  raw_text: string;
  tags: {
    classification: string[];
    sentiment: string[];
    action: string[];
    technical_depth: string;
    credibility: string[];
  };
  summary: {
    brief: string;
    key_points: string[];
    action_items?: string[];
  };
  metadata: {
    analyzed_at: string;
    word_count: number;
    topics: string[];
  };
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for providing the GPT API
- Next.js team for the amazing framework
- All contributors and users of this project

---

Built with ❤️ using Next.js and OpenAI

sequenceDiagram
participant Client as React Frontend
participant API as Next.js API Route
participant Parser as HTMLParser
participant AI as OpenAI Service

    Client->>API: POST /api/analyze (HTML)
    API->>Parser: Extract text
    Parser-->>API: Clean text
    API->>AI: Analyze text
    AI-->>API: Analysis results
    API-->>Client: Structured response
