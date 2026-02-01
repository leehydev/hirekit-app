import { Question } from '@/types/feed';

export const mockQuestions: Question[] = [
  {
    id: '1',
    title: 'How would you design a distributed rate limiter that handles 1 million requests per second across multiple regions?',
    tags: [
      { id: 't1', label: 'Major IT', variant: 'major' },
      { id: 't2', label: 'Backend', variant: 'category' },
    ],
    author: 'Anonymous',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
    status: 'passed',
    tipPreview: 'Focus on Redis with Lua scripts for atomicity. Mentioning sliding window logs vs counters shows...',
    quotePreview: '"I used a Token Bucket algorithm combined with..."',
    answerCount: 12,
  },
  {
    id: '2',
    title: 'Explain your process for handling conflicting feedback from a PM and an Engineering Lead during a high-stakes...',
    tags: [
      { id: 't3', label: 'Unicorn', variant: 'company' },
      { id: 't4', label: 'Product Design', variant: 'category' },
      { id: 't5', label: 'DesignMaster', variant: 'company' },
    ],
    author: 'Anonymous',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5h ago
    status: 'passed',
    tipPreview: 'Emphasize data-driven decision making. Suggesting a quick A/B test or user lookup usually wins them over...',
    answerCount: 8,
  },
  {
    id: '3',
    title: 'What strategies would you use to optimize database queries for a table with 100 million rows?',
    tags: [
      { id: 't6', label: 'Major IT', variant: 'major' },
      { id: 't7', label: 'Backend', variant: 'category' },
    ],
    author: 'Anonymous',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    status: 'passed',
    tipPreview: 'Discuss indexing strategies, partitioning, and query optimization. Mention specific database engines...',
    quotePreview: '"I would start by analyzing the query execution plan..."',
    answerCount: 15,
  },
  {
    id: '4',
    title: 'How do you approach technical debt in a fast-paced startup environment?',
    tags: [
      { id: 't8', label: 'Startups', variant: 'company' },
      { id: 't9', label: 'Backend', variant: 'category' },
    ],
    author: 'Anonymous',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    status: null,
    tipPreview: 'Balance velocity with maintainability. Discuss the importance of documenting technical debt...',
    answerCount: 6,
  },
];
