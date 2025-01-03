import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { query, history, context } = await req.json();
  const response = await fetch(`${process.env.PYTHON_SERVER_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, history, context }),
  });
  const data = await response.json();
  return NextResponse.json(data);
}
