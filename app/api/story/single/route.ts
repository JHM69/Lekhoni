import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth-options'; 
import * as lancedb from "@lancedb/lancedb"; 
import prisma from "@/prisma/prisma-client";
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
    const { rawText, storyId, translatedText, status = "PUBLIC", title, summary, tags, thumbnail } = body;

    if (!translatedText) {
      return NextResponse.json(
        { error: "translatedText is missing" },
        { status: 400 }
      );
    }
 
    const uri = "/tmp/lancedb/";
    const dbPromise = lancedb.connect(uri);

    const db = await dbPromise;

    const storyData = { 
      id: storyId,
      title: title || "", 
      content: translatedText,
      rawText: rawText,
      status: status,
      updatedAt: Date.now().toString(), // Convert to string
      summary: summary || "",
      tags: tags || "",
      thumbnail: thumbnail || ""
    };

    const tableNames = await db.tableNames();

    console.log({tableNames});

    if (tableNames.includes("story")) {
      const table = await db.openTable("story");
      await table.update(storyData, { where: "id = '"+ storyId +"'" });
      console.log('Story Updated in Database');

      return NextResponse.json(
        { 
          status: "success",
          storyId: storyData.id 
        },
        { status: 200 }
      );
    } else {
      console.log('Story Table Not Found');

      return NextResponse.json(
        { error: "Story Table Not Found" },
        { status: 500 }
      );
    }
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
   
    const storyId = searchParams.get('storyId') 
     

    const uri = "/tmp/lancedb/";
    const db = await lancedb.connect(uri);

    console.log(await db.tableNames());

    
    // db.dropTable("story");

    // show all tables

   

    const table = await db.openTable("story");


    console.log('StoryId to Fetch', storyId);


   
  
    const story = await table
    .query() 
    .where(`id = '${storyId}'`) 
    .select([
      "id",
      "title",
      "content",
      "rawText",
      "status",
      "liked",
      'authorId',
      'numberOfComments',
      "numberOfWords",
      "createdAt",
      "updatedAt",
      "pureHuman",
      "summary",
      "tags",
      "thumbnail"
    ])
    .toArray();


    const author = await prisma.user.findUnique({
      where: {
        id: story[0].authorId
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      }
    });
 
    return NextResponse.json(
      {
        status: "success",
        story: story,
        author: author
      },
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