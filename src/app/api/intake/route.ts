import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simulate ISO clean room ingress processing & hashing
    const timestamp = new Date().toISOString();
    const mockHash = `SHA256-0x${Math.random().toString(16).substring(2, 10)}`;

    console.log('[BACKEND INGRESS LOGGED]:', body);

    return NextResponse.json({
      success: true,
      status: 'LOGGED_TO_QUEUE',
      hash: mockHash,
      timestamp,
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process intake payload' },
      { status: 400 }
    );
  }
}