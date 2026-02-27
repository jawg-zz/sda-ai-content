# SDA Church Content Generator

AI-powered content generator for Seventh-day Adventist churches.

## Features
- Sermon outlines
- Daily devotionals
- Bible study guides
- Prayer points
- Church announcements

## Quick Start (Local)

```bash
# Clone the repository
git clone https://github.com/jawg-zz/sda-ai-content.git
cd sda-ai-content

# Create .env file
cp .env.example .env
# Edit .env with your API credentials

# Run with Docker Compose
docker compose up -d
```

## Deployment on Dokploy

### Option 1: Docker Compose (Recommended)
1. Push code to GitHub (already done)
2. In Dokploy, create a new project
3. Select "Docker Compose" as the deployment type
4. Connect your GitHub repository
5. Configure:
   - Docker Compose File: `docker-compose.yml`
   - Environment Variables:
     - `OPENAI_API_URL` = `https://aiproxy.spidmax.win/claude-kiro-oauth/v1`
     - `AI_API_KEY` = `spidmax`
6. Deploy

### Option 2: Docker
1. Build the image:
   ```bash
   docker build -t sda-content-generator .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 \
     -e OPENAI_API_URL=https://aiproxy.spidmax.win/claude-kiro-oauth/v1 \
     -e AI_API_KEY=spidmax \
     sda-content-generator
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_URL` | Your AI API endpoint | Yes |
| `AI_API_KEY` | Your API key | Yes |

## Tech Stack
- Next.js 15 (Standalone)
- React 19
- Node.js 22
- Docker

## License
MIT
