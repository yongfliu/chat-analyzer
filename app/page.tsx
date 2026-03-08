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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 获取聊天记录
    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/chat');
        
        if (!response.ok) {
          throw new Error(`服务器错误: ${response.status}`);
        }
        
        const data = await response.json();
        setChats(data);
      } catch (error: any) {
        console.error('Error fetching chats:', error);
        setError(error.message || '获取聊天记录失败');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: input }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('内容不能为空');
        } else {
          throw new Error(`服务器错误: ${response.status}`);
        }
      }

      const data = await response.json();

      // 更新聊天记录列表
      setChats([data, ...chats]);
      setInput('');
    } catch (error: any) {
      console.error('Error creating chat:', error);
      setError(error.message || '发送失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-2xl font-bold">小贝壳</h1>
        <p>直接聊天笔记系统</p>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-4">直接聊天</h2>

          {/* 错误提示 */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="直接和我聊天，我会帮你整理笔记..."
                className="flex-1 p-2 border border-gray-300 rounded"
                disabled={loading}
              />
              <button 
                type="submit" 
                className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
                disabled={loading}
              >
                {loading ? '发送中...' : '发送'}
              </button>
            </form>
          </div>

          {/* 聊天记录 */}
          {loading && chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">加载中...</div>
          ) : (
            <div className="space-y-2">
              {chats.map((chat) => (
                <div key={chat.id} className="p-2 border border-gray-300 rounded">
                  <p className="text-sm text-gray-500">{new Date(chat.createdAt).toLocaleString()}</p>
                  <p>{chat.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-blue-500 text-white p-4">
        <p>© 2025 小贝壳</p>
      </footer>
    </div>
  );
}