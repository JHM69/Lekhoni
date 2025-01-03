import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from "openai";
import * as lancedb from "@lancedb/lancedb";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth-options';
import { generateEmbedding } from '../utils/embedding-helper';
import { Story } from '@prisma/client';
 

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get search query from URL parameters
    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get('query');
    const limit = parseInt(searchParams.get('limit') || '30');

    // Connect to LanceDB
    const uri = "/tmp/lancedb/";
    const db = await lancedb.connect(uri);

    // Check if story table exists
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
      // Generate embedding for search query
      const queryEmbedding = await generateEmbedding(searchQuery);

      // Perform semantic search with filtering by authorId
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
        ])
        .execute();
    } else {
      // If no search query, just get all user's stories
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
          "pureHuman"
        ])
        .execute();
    }

    // Transform the data for response
    const formattedStories = stories.map(story => ({
      id: story.id,
      title: story.title,
      content: story.content,
      rawText: story.rawContent,
      status: story.status,
      liked: story.liked,
      numberOfComments: story.numberOfComments,
      numberOfWords: story.numberOfWords,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
      pureHuman: story.pureHuman,
      // Add similarity score if it's a semantic search
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
  