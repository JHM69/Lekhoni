import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  console.log(text);
  const response = await fetch(`${process.env.PYTHON_SERVER_URL}/custom`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  const data = await response.json();
  console.log(data);
  return NextResponse.json({ translatedText: data.translated_text });
}
