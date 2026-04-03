import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase-client';

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

export async function GET() {
  try {
    const now = Date.now();

    // Buscar mensagens não expiradas
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .gt('expires_at', now)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      return NextResponse.json({ messages: [] });
    }

    // Converter do formato Supabase para formato esperado
    const formattedMessages: Message[] = (messages || []).map((msg: any) => ({
      id: msg.id,
      author: msg.author,
      text: msg.text,
      timestamp: msg.timestamp,
      expiresAt: msg.expires_at,
      likes: msg.likes,
      comments: msg.comments || [],
    }));

    return NextResponse.json({
      messages: formattedMessages,
    });
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json({ messages: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { author, text, messageId, action, commentId } = body;

    // Ação de like em mensagem
    if (action === 'like-message' && messageId) {
      const { data: message, error: fetchError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('id', messageId)
        .single();

      if (fetchError || !message) {
        return NextResponse.json({ error: 'Message not found' }, { status: 404 });
      }

      const { error: updateError } = await supabase
        .from('chat_messages')
        .update({ likes: (message.likes || 0) + 1 })
        .eq('id', messageId);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, likes: (message.likes || 0) + 1 });
    }

    // Ação de like em comentário
    if (action === 'like-comment' && messageId && commentId) {
      const { data: message, error: fetchError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('id', messageId)
        .single();

      if (fetchError || !message) {
        return NextResponse.json({ error: 'Message not found' }, { status: 404 });
      }

      const comments = (message.comments || []).map((c: any) => {
        if (c.id === commentId) {
          return { ...c, likes: (c.likes || 0) + 1 };
        }
        return c;
      });

      const { error: updateError } = await supabase
        .from('chat_messages')
        .update({ comments })
        .eq('id', messageId);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    if (!author?.trim() || !text?.trim()) {
      return NextResponse.json(
        { error: 'Author and text are required' },
        { status: 400 }
      );
    }

    // Se é um comentário em uma mensagem existente
    if (messageId) {
      const { data: message, error: fetchError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('id', messageId)
        .single();

      if (fetchError || !message) {
        return NextResponse.json(
          { error: 'Message not found' },
          { status: 404 }
        );
      }

      const comment: Comment = {
        id: `comment-${Date.now()}-${Math.random()}`,
        author,
        text,
        timestamp: Date.now(),
        likes: 0,
      };

      const comments = [...(message.comments || []), comment];

      const { error: updateError } = await supabase
        .from('chat_messages')
        .update({ comments })
        .eq('id', messageId);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, comment });
    }

    // Se é uma nova mensagem principal
    const newMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      author,
      text,
      timestamp: Date.now(),
      expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 dias
      likes: 0,
      comments: [],
    };

    const { error: insertError } = await supabase
      .from('chat_messages')
      .insert([newMessage]);

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: {
        ...newMessage,
        expiresAt: newMessage.expires_at,
      },
    });
  } catch (error) {
    console.error('Error processing chat request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
