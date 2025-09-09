import { NextRequest, NextResponse } from 'next/server';
import { searchSchema, sanitizeInput, checkRateLimit } from '@/lib/validation';
import { aiService } from '@/lib/ai-service';

// Handle POST requests to /api/search
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    request.headers.get('cf-connecting-ip') || 
                    'unknown';

    // Check rate limiting
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes

    if (!checkRateLimit(clientIp, maxRequests, windowMs)) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.' 
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    
    // Sanitize the input
    if (body.query) {
      body.query = sanitizeInput(body.query);
    }

    const validatedData = searchSchema.parse(body);

    // Check if AI service is healthy
    const isHealthy = await aiService.checkHealth();
    if (!isHealthy) {
      return NextResponse.json(
        { 
          error: 'Service unavailable',
          message: 'AI search service is currently unavailable. Please ensure Ollama is running.' 
        },
        { status: 503 }
      );
    }

    // Perform the AI search
    const searchResults = await aiService.generateSearch(
      validatedData.query, 
      validatedData.limit
    );

    // Return successful response
    return NextResponse.json({
      success: true,
      data: searchResults,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Search API Error:', error);

    // Handle validation errors
    if (error && typeof error === 'object' && 'issues' in error) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          message: 'Invalid search parameters',
          details: error.issues 
        },
        { status: 400 }
      );
    }

    // Handle other errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'Search failed',
        message: errorMessage 
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for health checks
export async function GET() {
  try {
    const isHealthy = await aiService.checkHealth();
    
    return NextResponse.json({
      status: 'ok',
      ai_service: isHealthy ? 'healthy' : 'unavailable',
      timestamp: new Date().toISOString()
    });
  } catch (_error) {
    return NextResponse.json(
      { 
        status: 'error',
        ai_service: 'unavailable',
        message: 'Health check failed' 
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
