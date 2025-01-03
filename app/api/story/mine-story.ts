import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth-options';
import { generateEmbedding, dbPromise } from '../utils/embedding-helper';
import { Story } from './route';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get('query');
    const limit = parseInt(searchParams.get('limit') || '30');

    const db = await dbPromise;

    const tableNames = await db.tableNames();
    if (!tableNames.includes("story")) {
      return NextResponse.json(
        { stories: [] },
        { status: 200 }
      );
    }

    const table = await db.openTable("story");
    let stories : Story[] = [];

    if (searchQuery) {
      const queryEmbedding = await generateEmbedding(searchQuery);

      stories = await table.search(queryEmbedding)
        .where(`authorId = '${session.user.id}'`)
        .limit(limit)
        .select([
          "id",
          "title",
          "content",
          "rawText",
          "status",
          "liked",
          'numberOfComments',
          "numberOfWords",
          "createdAt",
          "updatedAt",
          "pureHuman",
          "summary",
          "tags",
          "thumbnail"
        ])
        .execute();
    } else {
      stories = await table.search()
        .where(`authorId = '${session.user.id}'`)
        .limit(limit)
        .select([
          "id",
          "title",
          "content",
          "rawText",
          "status",
          "liked",
          'numberOfComments',
          "numberOfWords",
          "createdAt",
          "updatedAt",
          "pureHuman",
          "summary",
          "tags",
          "thumbnail"
        ])
        .execute();
    }

    const formattedStories = stories.map(story => ({
      id: story.id,
      title: story.title,
      content: story.content,
      rawText: story.rawText,
      status: story.status,
      liked: story.liked,
      numberOfComments: story.numberOfComments,
      numberOfWords: story.numberOfWords,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
      pureHuman: story.pureHuman,
      summary: story.summary,
      tags: story.tags,
      thumbnail: story.thumbnail,
      ...(searchQuery && { similarity: story._distance }),
    }));

    return NextResponse.json(
      { 
        status: "success",
        stories: formattedStories
      },
      { status: 200 }
    );

  } catch (error) {
    console.error(`Error in GET /api/ai/banglish/save-story: ${error.message}`);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
