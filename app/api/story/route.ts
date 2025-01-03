import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth-options';
import { generateEmbedding, dbPromise } from '../utils/embedding-helper';

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
    } else {
      console.log(session);
    }

    const body = await request.json();
    const { rawText, translatedText, status = "PUBLIC", title, summary, tags, thumbnail } = body;

    if (!translatedText) {
      return NextResponse.json(
        { error: "translatedText is missing" },
        { status: 400 }
      );
    }

    const embedding = await generateEmbedding(translatedText);
    const db = await dbPromise;

    const storyData = {
      vector: embedding,
      id: crypto.randomUUID(),
      title: title || "", 
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
      summary: summary || "",
      tags: tags || "",
      thumbnail: thumbnail || ""
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
    
    const filters = {
      minLikes: parseInt(searchParams.get('minLikes') || '0'),
      maxLikes: parseInt(searchParams.get('maxLikes') || '999999'),
      createdAfter: parseInt(searchParams.get('createdAfter') || '0'),
      createdBefore: parseInt(searchParams.get('createdBefore') || Date.now().toString()),
      pureHuman: searchParams.get('pureHuman') === 'true' ? true : undefined,
      minWords: parseInt(searchParams.get('minWords') || '0'),
      maxWords: parseInt(searchParams.get('maxWords') || '999999'),
    };

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
      const queryEmbedding = await generateEmbedding(searchQuery);

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
          "authorId",
          "summary",
          "tags",
          "thumbnail"
        ])
        .execute();
    } else {
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
          "authorId",
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
  summary: string;
  tags: string;
  thumbnail: string;
  _distance?: number;
}