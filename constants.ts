import { LinkItem, Category } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'dev', name: '开发' },
  { id: 'design', name: '设计' },
  { id: 'news', name: '资讯' },
  { id: 'ai', name: 'AI 工具' },
  { id: 'social', name: '社交' },
];

export const INITIAL_LINKS: LinkItem[] = [
  {
    id: '1',
    title: 'GitHub',
    url: 'https://github.com',
    description: '全球最大的软件构建与协作平台。',
    category: 'dev',
    icon: '🐙',
    visits: 120
  },
  {
    id: '2',
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    description: '开发人员的专业问答社区。',
    category: 'dev',
    icon: '🥞',
    visits: 85
  },
  {
    id: '3',
    title: 'Figma',
    url: 'https://figma.com',
    description: '协作式界面设计工具。',
    category: 'design',
    icon: '🎨',
    visits: 95
  },
  {
    id: '4',
    title: 'Dribbble',
    url: 'https://dribbble.com',
    description: '发现全球顶尖设计师的创意作品。',
    category: 'design',
    icon: '🏀',
    visits: 40
  },
  {
    id: '5',
    title: 'Hacker News',
    url: 'https://news.ycombinator.com',
    description: '计算机科学新闻与讨论。',
    category: 'news',
    icon: 'Y',
    visits: 200
  },
  {
    id: '6',
    title: 'ChatGPT',
    url: 'https://chat.openai.com',
    description: 'OpenAI 开发的 AI 聊天助手。',
    category: 'ai',
    icon: '🤖',
    visits: 350
  },
  {
    id: '7',
    title: 'Google Gemini',
    url: 'https://gemini.google.com',
    description: '激发您的创造力与生产力。',
    category: 'ai',
    icon: '✨',
    visits: 300
  }
];

export const WALLPAPERS = [
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop", // Space
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop", // Landscape
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop", // Abstract
  "https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?q=80&w=2070&auto=format&fit=crop"  // Urban
];