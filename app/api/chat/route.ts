import { NextRequest, NextResponse } from 'next/server';
import { Chat } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 },
      );
    }

    const chat = await Chat.create({ content });

    return NextResponse.json({
      id: chat._id,
      content: chat.content,
      createdAt: chat.createdAt,
    });
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const chats = await Chat.find();

    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error getting chats:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
