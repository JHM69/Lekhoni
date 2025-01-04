import { OpenAIStream } from '@/types/chatStream'; 
import { ChatBody } from '@/types/types';
import { generateEmbedding } from '@/app/api/utils/embedding-helper';
import * as lancedb from "@lancedb/lancedb"; 

export async function POST(req: Request): Promise<Response> {
  console.log('Chat is called');
  try {
    const { inputMessage, model, history } = (await req.json()) as ChatBody;
    console.log('inputMessage', inputMessage, 'model', model, 'history', history);

    
  const storyKeywords = ['@story', '@Story', '@STORY', 'story', 'Story', 'STORY'];
  const containsStory = storyKeywords.some(keyword => inputMessage.includes(keyword));

  let context = undefined;
   
  if (containsStory) {
    try {
      const uri = "/tmp/lancedb/";
      const dbPromise = lancedb.connect(uri);
      const db = await dbPromise;
      const storyTable = await db.openTable("story");
      console.log('storyTable', storyTable);
      const queryEmbedding = await generateEmbedding(inputMessage);
      console.log('queryEmbedding', queryEmbedding); 
      const stories = await storyTable.search(queryEmbedding).limit(3).select
      (["title", "authorId", "id", "content", "tags", "summary", "thumbnail", "createdAt", "updatedAt", "numberOfWords", "numberOfComments", "liked", "status", "pureHuman"]).toArray(); 
      context = JSON.stringify(stories);

      console.log('context', context);
    }catch (error) {
      console.error('Error in story search', error);
    }
  }


    const stream = await OpenAIStream(inputMessage, model, history, context);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
}
