import { NextRequest, NextResponse } from 'next/server';
import { searchSchema, sanitizeInput, checkRateLimit } from '@/lib/validation';
import { huggingFaceService } from '@/lib/huggingface-service';

// Handle POST requests to /api/ai-search
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    request.headers.get('cf-connecting-ip') || 
                    'unknown';

    // Check rate limiting (stricter for AI searches due to higher cost)
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '50');
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes

    if (!checkRateLimit(clientIp, maxRequests, windowMs)) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: 'Too many AI search requests. Please try again later.' 
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

    // Check if Hugging Face AI service is healthy (now includes fallback mode)
    const isHealthy = await huggingFaceService.checkHealth();
    console.log('Hugging Face service health check result:', isHealthy);

    // Perform the AI search
    const searchResults = await huggingFaceService.generateSearch(
      validatedData.query, 
      validatedData.limit
    );

    // Return successful response
    return NextResponse.json({
      success: true,
      data: searchResults,
      timestamp: new Date().toISOString(),
      search_type: 'ai_powered'
    });

  } catch (error) {
    console.error('AI Search API Error:', error);

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

    // Handle Hugging Face API specific errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    if (errorMessage.includes('API key not configured')) {
      return NextResponse.json(
        { 
          error: 'Configuration error',
          message: 'Hugging Face API key is not properly configured' 
        },
        { status: 500 }
      );
    }

    if (errorMessage.includes('timeout')) {
      return NextResponse.json(
        { 
          error: 'Timeout error',
          message: 'AI search request timed out. Please try with a shorter query or try again later.' 
        },
        { status: 504 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { 
        error: 'AI search failed',
        message: errorMessage 
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for health checks
export async function GET() {
  try {
    const isHealthy = await huggingFaceService.checkHealth();
    
    return NextResponse.json({
      status: 'ok',
      ai_service: isHealthy ? 'healthy' : 'unavailable',
      provider: 'Hugging Face AI',
      model: process.env.HUGGINGFACE_EMBEDDING_MODEL || 'sentence-transformers/all-MiniLM-L6-v2',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Search Health Check Error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        ai_service: 'unavailable',
        message: 'AI search service is currently unavailable' 
      },
      { status: 503 }
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
