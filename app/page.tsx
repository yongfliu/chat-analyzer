'use client';

import { useState, useEffect } from 'react';

type Chat = {
  id: string;
  content: string;
  createdAt: Date;
};

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // 获取聊天记录
    const fetchChats = async () => {
      try {
        const response = await fetch('/api/chat');
        if (!response.ok) {
          throw new Error('获取聊天记录失败');
        }
        const data = await response.json();
        setChats(data);
      } catch (err) {
        console.error(err);
        setError('获取聊天记录失败');
      }
    };

    fetchChats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: input }),
      });

      if (!response.ok) {
        throw new Error('发送失败');
      }

      const data = await response.json();
      setChats([data, ...chats]);
      setInput('');
      setError('');
    } catch (err) {
      console.error(err);
      setError('发送失败');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">小贝壳</h1>
      <p className="text-center text-gray-600 mb-8">
        发送内容给我，我会保存下来并让你可以通过日期查询
      </p>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* 发送聊天记录 */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入要发送的内容..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            发送
          </button>
        </div>
      </form>

      {/* 聊天记录列表 */}
      <div>
        <h2 className="text-2xl font-bold mb-4">聊天记录</h2>
        {chats.length === 0 ? (
          <p className="text-center text-gray-500">暂无聊天记录</p>
        ) : (
          <div className="space-y-4">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-500">
                    {new Date(chat.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-800">{chat.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
