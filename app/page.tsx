'use client';

import { useState, useEffect } from 'react';

interface Chat {
  id: string;
  content: string;
  createdAt: string;
}

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // 获取聊天记录
    const fetchChats = async () => {
      try {
        const response = await fetch('/api/chat');
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    try {
      // 发送聊天记录
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: input }),
      });

      const data = await response.json();

      // 更新聊天记录列表
      setChats([data, ...chats]);
      setInput('');
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-2xl font-bold">小贝壳</h1>
        <p>聊天记录分析系统</p>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-4">聊天记录</h2>

          <div className="mb-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="请输入聊天记录"
                className="flex-1 p-2 border border-gray-300 rounded"
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                发送
              </button>
            </form>
          </div>

          <div className="space-y-2">
            {chats.map((chat) => (
              <div key={chat.id} className="p-2 border border-gray-300 rounded">
                <p className="text-sm text-gray-500">{new Date(chat.createdAt).toLocaleString()}</p>
                <p>{chat.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-blue-500 text-white p-4">
        <p>© 2025 小贝壳</p>
      </footer>
    </div>
  );
}