import { NextRequest, NextResponse } from 'next/server';
import { Chat } from '@/lib/db';

// 限流配置
const RATE_LIMIT = 100; // 每分钟最大请求数
const WINDOW_MS = 60 * 1000; // 限流窗口（毫秒）
const userRequests = new Map<string, { count: number; timestamp: number }>();

// 获取用户标识符
function getUserIdentifier(request: NextRequest): string {
  // 使用IP地址作为用户标识符
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  return ip;
}

// 检查是否限流
function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userData = userRequests.get(userId);

  if (!userData) {
    userRequests.set(userId, { count: 1, timestamp: now });
    return false;
  }

  // 检查是否在窗口内
  if (now - userData.timestamp > WINDOW_MS) {
    userRequests.set(userId, { count: 1, timestamp: now });
    return false;
  }

  // 检查请求数是否超过限制
  if (userData.count >= RATE_LIMIT) {
    return true;
  }

  // 增加请求数
  userData.count++;
  return false;
}

export async function POST(request: NextRequest) {
  // 检查限流
  const userId = getUserIdentifier(request);
  if (checkRateLimit(userId)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const chat = await Chat.create({ content });

    return NextResponse.json({ id: chat._id, content: chat.content, createdAt: chat.createdAt });
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 });

    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error getting chats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}