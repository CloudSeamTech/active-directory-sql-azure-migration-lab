import type { ReactNode } from 'react';

/** Reusable section scaffold for reviewed lessons added after design approval. */
export function LessonSection({ id, number, title, children }: { id: string; number: number; title: string; children: ReactNode }) {
  return <section id={id}><div className="section-title"><span>{String(number).padStart(2, '0')}</span><h2>{title}</h2></div>{children}</section>;
}

/** Authoring contract: planned entries must never be presented as published lessons. */
export interface LessonContent {
  id: string;
  pathway: number;
  title: string;
  duration: string;
  objectives: string[];
  enterpriseContext: string;
  prerequisites: string[];
  instructions: ReactNode;
  verification: ReactNode;
  troubleshooting: ReactNode;
  rollback: ReactNode;
  challenge: ReactNode;
  sources: { label: string; url: string }[];
}
