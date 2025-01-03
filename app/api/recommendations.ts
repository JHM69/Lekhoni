 
import { OpenAIRecommendationStream } from '@/types/recommendationStream';
import { ChatBody } from '@/types/types';

export const runtime = 'edge';
 
export async function POST(req: Request): Promise<Response> {
  try {
    const { inputMessage, model } = (await req.json()) as ChatBody;
 
    const stream = await OpenAIRecommendationStream(inputMessage, model);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
}
