'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: number;
  likes: number;
}

interface Message {
  id: string;
  author: string;
  text: string;
  timestamp: number;
  expiresAt: number;
  likes: number;
  comments: Comment[];
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');
  const [loading, setLoading] = useState(true);
  const [postingMessage, setPostingMessage] = useState(false);

  // Load messages when component mounts
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const res = await fetch('/api/chat', { cache: 'no-store' });
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !authorName.trim()) {
      alert('Please fill in name and message');
      return;
    }

    setPostingMessage(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: authorName, text: newMessage }),
      });

      if (res.ok) {
        setNewMessage('');
        setAuthorName('');
        setTimeout(() => loadMessages(), 500);
      }
    } catch (err) {
      console.error('Failed to post message:', err);
    } finally {
      setPostingMessage(false);
    }
  };

  const handlePostComment = async (messageId: string) => {
    if (!replyText.trim() || !replyAuthor.trim()) {
      alert('Please fill in name and comment');
      return;
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          author: replyAuthor,
          text: replyText,
        }),
      });

      if (res.ok) {
        setReplyText('');
        setReplyAuthor('');
        setExpandedMessage(null);
        setTimeout(() => loadMessages(), 500);
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  const handleLikeMessage = async (messageId: string) => {
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like-message', messageId }),
      });
      loadMessages();
    } catch (err) {
      console.error('Failed to like:', err);
    }
  };

  const handleLikeComment = async (messageId: string, commentId: string) => {
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'like-comment',
          messageId,
          commentId,
        }),
      });
      loadMessages();
    } catch (err) {
      console.error('Failed to like comment:', err);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;

    return date.toLocaleDateString();
  };

  const getRemainingTime = (expiresAt: number) => {
    const remaining = Math.max(0, expiresAt - Date.now());
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
    const hours = Math.floor(
      (remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
    );

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return 'Expires soon';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Formiga Grande
          </Link>
          <div className="flex gap-6">
            <Link href="/sobre" className="text-gray-700 hover:text-blue-600 font-semibold">
              Sobre
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 font-semibold">
              Blog
            </Link>
            <Link href="/suporte" className="text-gray-700 hover:text-blue-600 font-semibold">
              Suporte
            </Link>
            <Link href="/contato" className="text-gray-700 hover:text-blue-600 font-semibold">
              Contacto
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Community Chat</h1>
          <p className="text-xl text-purple-100">Leave messages and questions for the community</p>
          <p className="text-sm text-purple-200">💡 Messages expire after 7 days</p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <section className="bg-white p-8 rounded-lg shadow-lg mb-12">
          <h2 className="text-2xl font-bold mb-6">📝 Leave a Message</h2>
          <form onSubmit={handlePostMessage} className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
            <textarea
              placeholder="Your message..."
              rows={4}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
            <button
              type="submit"
              disabled={postingMessage}
              className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
            >
              {postingMessage ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">💬 Community Messages</h2>

          <div className="mb-6 p-4 bg-blue-50 rounded">
            {loading ? '🔄 Loading...' : `✅ ${messages.length} messages`}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="bg-white p-8 rounded-lg text-center">
              <p className="text-gray-500">No messages yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-lg">{message.author}</p>
                      <p className="text-sm text-gray-500">{formatDate(message.timestamp)}</p>
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded">
                      {getRemainingTime(message.expiresAt)}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">{message.text}</p>

                  <button
                    onClick={() => handleLikeMessage(message.id)}
                    className="text-red-500 hover:text-red-600 font-semibold mb-4"
                  >
                    ❤️ {message.likes}
                  </button>

                  {message.comments.length > 0 && (
                    <div className="bg-gray-50 rounded p-4 mb-4">
                      <p className="text-sm font-semibold text-gray-600 mb-3">
                        {message.comments.length} comment(s)
                      </p>
                      <div className="space-y-3">
                        {message.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-white p-3 rounded border-l-2 border-pink-500"
                          >
                            <p className="text-sm font-semibold">{comment.author}</p>
                            <p className="text-xs text-gray-500 mb-2">{formatDate(comment.timestamp)}</p>
                            <p className="text-gray-700 text-sm">{comment.text}</p>
                            <button
                              onClick={() => handleLikeComment(message.id, comment.id)}
                              className="mt-2 text-red-500 text-sm"
                            >
                              ❤️ {comment.likes}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() =>
                      setExpandedMessage(expandedMessage === message.id ? null : message.id)
                    }
                    className="text-purple-600 font-semibold text-sm"
                  >
                    {expandedMessage === message.id ? '✕ Cancel' : '+ Comment'}
                  </button>

                  {expandedMessage === message.id && (
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <input
                        type="text"
                        placeholder="Your name"
                        value={replyAuthor}
                        onChange={(e) => setReplyAuthor(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                      <textarea
                        placeholder="Your comment..."
                        rows={3}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                      <button
                        onClick={() => handlePostComment(message.id)}
                        className="w-full bg-pink-600 text-white font-semibold py-2 rounded hover:bg-pink-700"
                      >
                        Send Comment
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2026 Formiga Grande. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
