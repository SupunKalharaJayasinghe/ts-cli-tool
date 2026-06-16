import path from 'node:path';
import type { CreatePlan } from '../types.js';
import { writeFileSafe } from '../utils/files.js';
import { toTitle } from '../utils/strings.js';

export async function applyAiPlan(plan: CreatePlan): Promise<void> {
  if (plan.blueprint !== 'ai-app') {
    throw new Error('applyAiPlan can only be used with ai-app plans.');
  }

  await writeLayout(plan);
  await writeHomePage(plan);
  await writeChatRoute(plan);
  await writeChatComponents(plan);
  await writeAiLib(plan);
  await writeAiTypes(plan);
}

async function writeLayout(plan: CreatePlan): Promise<void> {
  await writeFileSafe(
    path.join(plan.targetPath, 'src/app/layout.tsx'),
    `import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: '${toTitle(plan.projectName)}',
  description: 'Generated AI application starter.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`
  );
}

async function writeHomePage(plan: CreatePlan): Promise<void> {
  const intro =
    plan.shape === 'chat'
      ? 'A starter chat experience for building conversational AI products.'
      : plan.shape === 'assistant'
        ? 'A starter assistant experience for building AI-powered workflows.'
        : 'A starter content generation experience for building AI tools.';

  await writeFileSafe(
    path.join(plan.targetPath, 'src/app/page.tsx'),
    `import { Chat } from '@/components/chat/Chat';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-10">
      <section className="mb-8">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-500">
          AI app starter
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-slate-950">
          ${toTitle(plan.projectName)}
        </h1>

        <p className="mt-4 max-w-2xl text-slate-600">
          ${intro}
        </p>
      </section>

      <Chat />
    </main>
  );
}
`
  );
}

async function writeChatRoute(plan: CreatePlan): Promise<void> {
  await writeFileSafe(
    path.join(plan.targetPath, 'src/app/api/chat/route.ts'),
    `import { getSystemPrompt } from '@/lib/ai';

export async function POST(req: Request) {
  const body = await req.json();
  const messages = Array.isArray(body.messages) ? body.messages : [];

  return Response.json({
    id: crypto.randomUUID(),
    role: 'assistant',
    content:
      'This is a placeholder AI response. Connect your preferred AI provider inside src/app/api/chat/route.ts.',
    systemPrompt: getSystemPrompt(),
    receivedMessages: messages.length,
    blueprint: '${plan.shape}',
  });
}
`
  );
}

async function writeChatComponents(plan: CreatePlan): Promise<void> {
  await writeFileSafe(
    path.join(plan.targetPath, 'src/components/chat/Chat.tsx'),
    `'use client';

import { useState } from 'react';
import type { ChatMessage } from '@/types/ai';
import { ChatInput } from './ChatInput';
import { MessageList } from './MessageList';

const initialMessages: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content:
      'Hello! This is your generated AI app starter. Replace the placeholder API route with your real AI provider logic.',
  },
];

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSendMessage(content: string) {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    };

    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response.');
      }

      const data = (await response.json()) as ChatMessage;

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: data.id ?? crypto.randomUUID(),
          role: 'assistant',
          content: data.content,
        },
      ]);
    } catch {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            'Something went wrong while calling the AI route. Check src/app/api/chat/route.ts.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="flex min-h-[600px] flex-col rounded-2xl border border-slate-200 bg-white">
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput disabled={isLoading} onSendMessage={handleSendMessage} />
    </section>
  );
}
`
  );

  await writeFileSafe(
    path.join(plan.targetPath, 'src/components/chat/MessageList.tsx'),
    `import type { ChatMessage } from '@/types/ai';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-6">
      {messages.map((message) => (
        <article
          className="rounded-xl border border-slate-200 p-4"
          key={message.id}
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {message.role === 'user' ? 'You' : 'AI'}
          </p>

          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {message.content}
          </p>
        </article>
      ))}

      {isLoading ? (
        <article className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">AI is thinking...</p>
        </article>
      ) : null}
    </div>
  );
}
`
  );

  await writeFileSafe(
    path.join(plan.targetPath, 'src/components/chat/ChatInput.tsx'),
    `'use client';

import { useState } from 'react';

interface ChatInputProps {
  disabled: boolean;
  onSendMessage: (content: string) => Promise<void>;
}

export function ChatInput({ disabled, onSendMessage }: ChatInputProps) {
  const [input, setInput] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = input.trim();

    if (!content) {
      return;
    }

    setInput('');
    await onSendMessage(content);
  }

  return (
    <form
      className="flex gap-3 border-t border-slate-200 p-4"
      onSubmit={handleSubmit}
    >
      <input
        className="flex-1 rounded-md border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-950"
        disabled={disabled}
        onChange={(event) => setInput(event.currentTarget.value)}
        placeholder="Ask something..."
        type="text"
        value={input}
      />

      <button
        className="rounded-md bg-slate-950 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        type="submit"
      >
        Send
      </button>
    </form>
  );
}
`
  );
}

async function writeAiLib(plan: CreatePlan): Promise<void> {
  const systemPrompt =
    plan.shape === 'chat'
      ? 'You are a helpful AI chat assistant.'
      : plan.shape === 'assistant'
        ? 'You are a practical AI assistant that helps users complete workflows.'
        : 'You are an AI content generation assistant.';

  await writeFileSafe(
    path.join(plan.targetPath, 'src/lib/ai.ts'),
    `export function getSystemPrompt(): string {
  return '${systemPrompt}';
}

export const aiConfig = {
  blueprint: '${plan.shape}',
  model: process.env.AI_MODEL ?? 'your-model-name',
  apiKey: process.env.AI_API_KEY,
} as const;
`
  );
}

async function writeAiTypes(plan: CreatePlan): Promise<void> {
  await writeFileSafe(
    path.join(plan.targetPath, 'src/types/ai.ts'),
    `export type AiAppShape = 'chat' | 'assistant' | 'content-generator';

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

export interface AiAppConfig {
  name: string;
  shape: AiAppShape;
}
`
  );
}
