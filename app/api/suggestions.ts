import { OpenAIRecommendationStream } from '@/types/recommendationStream';

export const runtime = 'edge';

export async function POST(req: Request): Promise<Response> {
  try {
    const { text, model } = await req.json();
    const stream = await OpenAIRecommendationStream(text, model);
    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
}
