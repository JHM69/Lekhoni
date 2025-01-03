import { NextRequest, NextResponse } from 'next/server';

import * as lancedb from "@lancedb/lancedb";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth-options';
import { generateEmbedding } from '../utils/embedding-helper';
 
 
 
export async function POST(request: NextRequest) {
  console.log('Story Adding to Database');
  try {
    const session = await getServerSession(authOptions);

    console.log('session', session);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }else{
      console.log(session);
    }

    const body = await request.json();
    const { rawText, translatedText, status = "PUBLIC" } = body;

    if (!translatedText) {
      return NextResponse.json(
        { error: "translatedText is missing" },
        { status: 400 }
      );
    }

    const embedding = await generateEmbedding(translatedText);
    const uri = "/tmp/lancedb/";
    const db = await lancedb.connect(uri);

    const storyData = {
      vector: embedding,
      id: crypto.randomUUID(),
      title: "", 
      content: translatedText,
      rawText: rawText,
      authorId: session.user.id,
      status: status,
      liked: 0,
      numberOfComments: 0,
      numberOfWords: Math.round(translatedText.split(/\s+/).length),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      pureHuman: true,
    };

    console.log({storyData});

    const tableNames = await db.tableNames();

 
    if (tableNames.includes("story")) {
      const table = await db.openTable("story");
      await table.add([storyData]);
    } else {
      const table = await db.createTable("story", [storyData], { mode: "overwrite" });
      await table.createIndex("authorId");
    }

    return NextResponse.json(
      { 
        status: "success",
        storyId: storyData.id 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error(`Error in POST /api/story: ${error.message}`);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
 

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

    // Get search query and filters from URL parameters
    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get('query');
    const limit = parseInt(searchParams.get('limit') || '30');
    
    // Parse filter parameters
    const filters = {
      minLikes: parseInt(searchParams.get('minLikes') || '0'),
      maxLikes: parseInt(searchParams.get('maxLikes') || '999999'),
      createdAfter: parseInt(searchParams.get('createdAfter') || '0'),
      createdBefore: parseInt(searchParams.get('createdBefore') || Date.now().toString()),
      pureHuman: searchParams.get('pureHuman') === 'true' ? true : undefined,
      minWords: parseInt(searchParams.get('minWords') || '0'),
      maxWords: parseInt(searchParams.get('maxWords') || '999999'),
    };

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

    // Build where clause
    let whereConditions = [
      "status = 'PUBLIC'",
      `liked >= ${filters.minLikes}`,
      `liked <= ${filters.maxLikes}`,
      `createdAt >= ${filters.createdAfter}`,
      `createdAt <= ${filters.createdBefore}`,
      `numberOfWords >= ${filters.minWords}`,
      `numberOfWords <= ${filters.maxWords}`,
    ];

    if (filters.pureHuman !== undefined) {
      whereConditions.push(`pureHuman = ${filters.pureHuman}`);
    }

    const whereClause = whereConditions.join(" AND ");

    if (searchQuery) {
      // Generate embedding for search query
      const queryEmbedding = await generateEmbedding(searchQuery);

      // Perform semantic search with filtering by authorId
       stories = await table.search(queryEmbedding)
        .where(whereClause)
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
          "authorId"
        ])
        .execute();
    } else {
      // If no search query, just get all user's stories
      stories = await table.search()
        .where(whereClause)
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
          "authorId"
        ])
        .execute();
    }

    // Transform the data for response
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
 
// Optional: Add type definitions for better type safety
export interface Story {
  id: string;
  title: string;
  content: string;
  rawText: string;
  status: string;
  liked: number;
  numberOfComments: number;
  numberOfWords: number;
  createdAt: number;
  updatedAt: number;
  pureHuman: boolean;
  authorId: string;
  _distance?: number;
}