import path from 'node:path';
import type { CreatePlan } from '../types.js';
import { writeFileSafe } from '../utils/files.js';
import { toTitle } from '../utils/strings.js';
import { starterBranding } from './starterBranding.js';

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
  title: ${JSON.stringify(toTitle(plan.projectName))},
  description: 'Generated AI application starter.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
`
  );
}

async function writeHomePage(plan: CreatePlan): Promise<void> {
  const intro =
    plan.shape === 'chat'
      ? 'A premium starter chat experience for building conversational AI products.'
      : plan.shape === 'assistant'
        ? 'A premium starter assistant experience for building AI-powered workflows.'
        : 'A premium starter content generation experience for building AI tools.';

  await writeFileSafe(
    path.join(plan.targetPath, 'src/app/page.tsx'),
    `import { Chat } from '@/components/chat/Chat';
import { Sparkles, Terminal, Settings, Cpu, Database } from 'lucide-react';

export default function HomePage() {
  const intro = '${intro}';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-blue-500/30">
              AI
            </span>
            <span className="text-base font-bold tracking-tight text-slate-900">${toTitle(plan.projectName)}</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="${starterBranding.githubUrl}"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition"
            >
              GitHub Docs
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-12 grid gap-8 md:grid-cols-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 -z-10 h-72 w-72 rounded-full bg-blue-400/5 blur-3xl pointer-events-none" />

        {/* Left Column: AI Config Info Card */}
        <section className="md:col-span-1 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="h-5 w-5 text-blue-600" />
              <h2 className="font-bold text-slate-950 text-base">Specifications</h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Details about your configured AI model integration.
            </p>
            
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 font-semibold">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Blueprint</span>
                <span className="text-xs text-slate-700">${plan.shape}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Model</span>
                <code className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono text-blue-600">gpt-4o / gemini-1.5</code>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">API Route</span>
                <code className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-650">/api/chat</code>
              </div>
            </div>
          </div>

          {/* Model Capabilities Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-slate-950 text-base">Model Tuning</h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-slate-400" />
                <span>Temperature: 0.7</span>
              </li>
              <li className="flex items-center gap-2">
                <Database className="h-4 w-4 text-slate-400" />
                <span>Max Tokens: 4096</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 shadow-sm flex items-start gap-4">
            <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wide">Developer Tip</h3>
              <p className="mt-2 text-xs text-blue-800 leading-relaxed font-medium">
                Connect this app to OpenAI, Anthropic, or Google Gemini by editing the backend route in <code className="font-mono text-[10px] bg-blue-100/50 px-1.5 py-0.5 rounded text-blue-900">src/app/api/chat/route.ts</code>.
              </p>
            </div>
          </div>
        </section>

        {/* Right Column: Chat Box */}
        <section className="md:col-span-3 flex flex-col">
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-3">
              <Sparkles className="h-3 w-3 animate-pulse" />
              AI App Scaffolding
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Interactive Chat Console</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">{intro}</p>
          </div>
          <Chat />
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} ${toTitle(plan.projectName)}. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5">
            <span>Generated with ${starterBranding.cliName} ${starterBranding.version}</span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-550">${starterBranding.releaseName}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
`
  );
}

async function writeChatRoute(plan: CreatePlan): Promise<void> {
  await writeFileSafe(
    path.join(plan.targetPath, 'src/app/api/chat/route.ts'),
    `import { getSystemPrompt } from '@/lib/ai';
import { z } from 'zod';

const ChatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string().min(1).max(8000),
      })
    )
    .min(1)
    .max(50),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: 'Request did not match the expected shape.', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { messages } = parsed.data;

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
    <div className="flex flex-col h-[520px] rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput disabled={isLoading} onSendMessage={handleSendMessage} />
    </div>
  );
}
`
  );

  await writeFileSafe(
    path.join(plan.targetPath, 'src/components/chat/MessageList.tsx'),
    `import type { ChatMessage } from '@/types/ai';
import { Bot, User } from 'lucide-react';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-6 bg-slate-50/30">
      {messages.map((message) => {
        const isUser = message.role === 'user';
        return (
          <div
            className={\`flex \${isUser ? 'justify-end' : 'justify-start'}\`}
            key={message.id}
          >
            <div
              className={\`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm \${
                isUser
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
              }\`}
            >
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">
                {isUser ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                {isUser ? 'You' : 'AI Assistant'}
              </span>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        );
      })}

      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-2xl rounded-bl-none border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
            <span className="flex items-center gap-1 py-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '0ms' }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '150ms' }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '300ms' }} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
`
  );

  await writeFileSafe(
    path.join(plan.targetPath, 'src/components/chat/ChatInput.tsx'),
    `'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

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
      className="flex gap-3 border-t border-slate-200 p-4 bg-white"
      onSubmit={handleSubmit}
    >
      <input
        className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
        disabled={disabled}
        onChange={(event) => setInput(event.currentTarget.value)}
        placeholder="Type a message..."
        type="text"
        value={input}
      />

      <button
        className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition disabled:cursor-not-allowed disabled:opacity-50 inline-flex items-center gap-1.5"
        disabled={disabled}
        type="submit"
      >
        <span>Send</span>
        <Send className="h-4 w-4" />
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
