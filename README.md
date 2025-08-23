
# GhostQuery Secure & Smart Search Portal for Open Data

A mini project for implementing an AI-powered, secure, and SEO-optimized search portal for open data.  
**Note:** This project is designed for group collaboration.

## Features

- **Frontend:**  
	- Built with Next.js (React-based static site generator)  
	- Clean, responsive UI with a search bar and results display  
	- Accessibility-focused design

- **AI-Powered Search:**  
	- Integrates with an AI search API (OpenAI, Typesense, or a fine-tuned local model)  
	- Supports structured queries and semantic relevance

- **Security:**  
	- Enforces HTTPS, CSP, and CORS  
	- Input sanitization to prevent XSS/SQL injection  
	- Secure API keys/tokens via environment variables

- **SEO Optimization:**  
	- Basic meta tags and schema.org markup  
	- Core Web Vitals optimization (lazy loading, fast LCP)

- **Privacy:**  
	- No user tracking or cookie-based profiling  
	- Optional integration with DuckDuckGo

## Getting Started

1. **Clone the repository:**
	 ```bash
	 git clone https://github.com/kalchan12/GhostQuery.git
	 cd GhostQuery
	 ```

2. **Install dependencies:**
	 ```bash
	 pnpm install
	 ```

3. **Set up environment variables:**  
	 Create a `.env.local` file and add your API keys/tokens.

4. **Run the development server:**
	 ```bash
	 pnpm dev
	 ```

5. **Build for production:**
	 ```bash
	 pnpm build
	 pnpm start
	 ```

## Security & Privacy

- All user input is sanitized.
- No cookies or tracking scripts are used.
- API keys are never exposed to the client.

## SEO

- Meta tags and schema.org markup included.
- Optimized for fast load times and accessibility.


