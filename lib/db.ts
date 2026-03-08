import mongoose from 'mongoose';

// 连接到 MongoDB 数据库
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-analyzer';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// 使用模块级别的变量来存储连接对象，避免使用global
let cached: {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
} | null = null;

async function dbConnect() {
  if (cached) {
    return cached.conn;
  }

  if (!cached) {
    cached = { conn: null, promise: null };

    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;

// 定义聊天记录模型
const chatSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);
