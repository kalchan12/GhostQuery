# GhostQuery Setup Guide

## Prerequisites

1. **Node.js 18+** and **pnpm** installed
2. **Ollama** for the AI backend

## Ollama Installation & Setup

### Install Ollama (Linux)
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Start Ollama service (automatically starts on system boot)
sudo systemctl start ollama
sudo systemctl enable ollama

# Or run manually
ollama serve
```

### Download AI Model
```bash
# Download a lightweight model (recommended for testing)
ollama pull llama3.2:3b

# Alternative models:
# ollama pull llama3.2:1b    # Even smaller/faster
# ollama pull llama3.1:8b    # Larger/better quality
```

### Verify Ollama is Running
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Should return JSON with available models
```

## Application Setup

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Environment Configuration**
   - The `.env.local` file is already created with default settings
   - Modify if needed:
     ```env
     OLLAMA_BASE_URL=http://localhost:11434
     OLLAMA_MODEL=llama3.2:3b
     ```

3. **Run Development Server**
   ```bash
   pnpm dev
   ```

4. **Open Application**
   - Navigate to: http://localhost:3000

## Testing the Setup

### Test API Endpoint Directly
```bash
# Health check
curl http://localhost:3000/api/search

# Search test
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "climate data"}'
```

### Test in Browser
1. Open http://localhost:3000
2. Enter a search query like "climate change data"
3. Click "EXECUTE" or press Enter
4. Wait for AI processing (may take 10-30 seconds)

## Troubleshooting

### Ollama Issues
- **Service not running**: `sudo systemctl start ollama`
- **Model not found**: `ollama pull llama3.2:3b`
- **Port 11434 busy**: Check if another Ollama instance is running

### API Issues
- **503 Service Unavailable**: Ollama is not running or model not loaded
- **Timeout errors**: Try a smaller model like `llama3.2:1b`
- **Rate limiting**: Wait 15 minutes or restart the application

### Performance Tips
- **Faster responses**: Use `llama3.2:1b` model
- **Better quality**: Use `llama3.1:8b` model (requires more RAM)
- **GPU acceleration**: Install Ollama with CUDA support if available

## Production Deployment

For production deployment:

1. **Environment Variables**
   ```env
   NODE_ENV=production
   OLLAMA_BASE_URL=http://your-ollama-server:11434
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

2. **Build Application**
   ```bash
   pnpm build
   pnpm start
   ```

3. **Ollama in Production**
   - Run Ollama on a dedicated server with sufficient RAM
   - Use GPU acceleration for better performance
   - Consider load balancing for high traffic

## Model Recommendations

| Model | Size | Speed | Quality | RAM Required |
|-------|------|-------|---------|--------------|
| llama3.2:1b | ~1GB | Fast | Good | 4GB+ |
| llama3.2:3b | ~3GB | Medium | Better | 8GB+ |
| llama3.1:8b | ~8GB | Slow | Best | 16GB+ |

Choose based on your system capabilities and quality requirements.
