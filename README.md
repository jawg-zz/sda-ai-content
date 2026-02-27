# SDA Church Content Generator

AI-powered content generator for Seventh-day Adventist churches.

## Features
- Sermon outlines
- Daily devotionals
- Bible study guides
- Prayer points
- Church announcements

## Deployment

### Dokploy
1. Push this code to GitHub/GitLab
2. In Dokploy, create a new project
3. Add repository and configure:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Port: `3000`
   - Install Command: `npm install`

### Environment Variables
Set these in your Dokploy environment:
- `OPENAI_API_URL` - Your AI endpoint (e.g., `https://aiproxy.spidmax.win/claude-kiro-oauth/v1`)
- `AI_API_KEY` - Your API key

## Local Development
```bash
npm install
npm run dev
```

## Tech Stack
- Next.js 15
- React 19
- Tailwind CSS (optional)
- OpenAI-compatible API
