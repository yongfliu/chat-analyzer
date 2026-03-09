const { Low, JSONFile } = require('lowdb');
const fs = require('fs');
const path = require('path');

// 数据库文件路径
const dbPath = path.join(process.cwd(), 'data', 'db.json');

// 确保数据目录存在
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

// 初始化数据库
const adapter = new JSONFile(dbPath);
const db = new Low(adapter);

// 数据库初始化数据
const defaultData = {
  chats: []
};

// 初始化数据库
async function initDb() {
  await db.read();
  db.data = db.data || defaultData;
  await db.write();
}

// 聊天记录模型
class Chat {
  static async create(data) {
    await db.read();
    const chat = {
      _id: Date.now().toString(),
      content: data.content,
      createdAt: new Date()
    };
    db.data.chats.push(chat);
    await db.write();
    return chat;
  }

  static async find() {
    await db.read();
    return db.data.chats;
  }

  static async findById(id) {
    await db.read();
    return db.data.chats.find(chat => chat._id === id);
  }

  static async findOne(query) {
    await db.read();
    return db.data.chats.find(chat => chat.content === query.content);
  }
}

// 初始化数据库
initDb();

// 导出模块
module.exports = {
  db,
  Chat,
  initDb
};
