import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth-options';
import { generateEmbedding, } from '../utils/embedding-helper';
import * as lancedb from "@lancedb/lancedb"; 
export async function POST(request: NextRequest) {
  console.log('Story Adding to Database');
  // createStoryIndex();
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
    const uri = "/tmp/lancedb/";
    const dbPromise = lancedb.connect(uri);

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
      numberOfWords: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      pureHuman: true,
      summary: summary || "",
      tags: tags || "",
      thumbnail: thumbnail || ""
    };

 
    const tableNames = await db.tableNames();

    console.log({tableNames});



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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get('query') || '';
    const sortBy = searchParams.get('sortBy') || 'latest';
    const selectedTag = searchParams.get('tag') || 'all';
    const limit = parseInt(searchParams.get('limit') || '30');

    const uri = "/tmp/lancedb/";
    const db = await lancedb.connect(uri);
    const table = await db.openTable("story");

    let whereConditions = ["status = 'PUBLIC'"];
    
    // Handle tag filtering
    if (selectedTag === 'my-stories') {
      whereConditions = [`authorId = '${session.user.id}'`];
    } else if (selectedTag !== 'all') {
      whereConditions.push(`tags LIKE '%${selectedTag}%'`);
    }

    const whereClause = whereConditions.join(" AND ");
    let query;

    if (searchQuery) {
      const embedding = await generateEmbedding(searchQuery);
      query = table.search(embedding)
        .where(whereClause)
        .limit(limit);
    } else {
      query = table.query()
        .where(whereClause)
        .limit(limit);

      // Apply sorting
      switch (sortBy) {
        case 'latest':
          query = query.orderBy('createdAt', 'desc');
          break;
        case 'popular':
          query = query.orderBy('liked', 'desc');
          break;
        case 'oldest':
          query = query.orderBy('createdAt', 'asc');
          break;
      }
    }

    const stories = await query
      .select([
        "id", "title", "content", "rawText", "status",
        "liked", "numberOfComments", "numberOfWords",
        "createdAt", "updatedAt", "pureHuman", "authorId",
        "summary", "tags", "thumbnail"
      ])
      .toArray();

    const formattedStories = stories.map((story: Story) => ({
      ...story,
      ...(searchQuery && { similarity: story._distance }),
    }));

    return NextResponse.json(
      { status: "success", stories: formattedStories },
      { status: 200 }
    );

  } catch (error) {
    console.error(`Error in GET /api/story: ${error.message}`);
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