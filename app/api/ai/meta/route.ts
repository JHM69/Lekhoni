import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  console.log(text);
  const response = await fetch(`${process.env.PYTHON_SERVER_URL}/meta`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  const data = await response.json();
  return NextResponse.json({ meta: data.meta });
}
