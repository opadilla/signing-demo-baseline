'use server'
import { NextRequest, NextResponse } from 'next/server';
import axios from "axios";

const DWS_API_BASE_URL = "https://api.nutrient.io";

export async function POST(req: NextRequest) {
  try {
    // instead of handling the PDF signing directly, generate a signing token that the client can use with the Web SDK
    const response = await axios.post(`${DWS_API_BASE_URL}/tokens`, {
      allowedOperations: ['digital_signatures_api'],
      // update with actual allowed origins
      allowedOrigins: [process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'],
      expirationTime: 3600  // 1 hour
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_NUTRIENT_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return NextResponse.json({
      accessToken: response.data.accessToken,
      tokenId: response.data.id
    }, { status: 200 });

  } catch (error) {
    console.error('Error generating signing token:', error);
    console.error('Error details:', error.response?.data);
    console.error('Error status:', error.response?.status);
    return NextResponse.json({ error: 'Error in token generation process' }, { status: 500 });
  }
}

// removed GET endpoint since certificate fetching is now handled by the Web SDK