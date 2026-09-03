export interface Project {
  id: string;
  code: string;
  title: string;
  tagline: string;
  description: string;
  architectureDetails: string[];
  metrics: { label: string; value: string }[];
  stack: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

export interface SkillCategory {
  id: string;
  title: string;
  iconName: string;
  level: number; // 1 to 5
  skills: string[];
}

export interface Achievement {
  id: string;
  year: string;
  type: string;
  title: string;
  description: string;
}

export type SectorStage = 'stratosphere' | 'datacenter' | 'silicon' | 'neural-core';
