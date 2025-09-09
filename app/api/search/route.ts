import { NextRequest, NextResponse } from 'next/server';
import { searchSchema, sanitizeInput, checkRateLimit } from '@/lib/validation';
import { openDataService } from '@/lib/open-data-service';

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

    // Check if open data service is healthy
    const isHealthy = await openDataService.checkHealth();
    if (!isHealthy) {
      console.warn('Some data sources may be unavailable, proceeding with fallback');
      // Don't fail completely, as we have fallback data
    }

    // Perform the open data search
    const searchResults = await openDataService.searchOpenData(
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
    const isHealthy = await openDataService.checkHealth();
    
    return NextResponse.json({
      status: 'ok',
      data_service: isHealthy ? 'healthy' : 'fallback_available',
      sources: ['Data.gov (USA)', 'EU Open Data Portal', 'Fallback Sources'],
      timestamp: new Date().toISOString()
    });
  } catch (_error) {
    return NextResponse.json(
      { 
        status: 'ok',
        data_service: 'fallback_available',
        message: 'Using fallback data sources' 
      },
      { status: 200 }
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
