import { OpenAIStream } from '@/types/chatStream'; 
import { ChatBody } from '@/types/types';

export const runtime = 'edge';
 
export async function POST(req: Request): Promise<Response> {
  try {
    const { inputMessage, model, history } = (await req.json()) as ChatBody;
 
    const stream = await OpenAIStream(inputMessage, model, history as string);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
}
