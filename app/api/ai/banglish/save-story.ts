import { NextRequest, NextResponse } from 'next/server'; 
import * as lancedb from "@lancedb/lancedb";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth-options';
import { generateEmbedding } from '../../utils/embedding-helper';
 
 
export async function POST(request: NextRequest) {
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
      rawContent: rawText,
      numberOfWords: Math.round(translatedText.split(/\s+/).length),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      pureHuman: true,
    };

    console.log({storyData});

    const tableNames = await db.tableNames();

    db.dropTable("story");

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
 
 
 