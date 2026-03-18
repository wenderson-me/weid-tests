export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'manager';
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export type TaskStatus = 'todo' | 'inProgress' | 'inReview' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  estimatedHours?: number;
  owner: User;
  assignees?: User[];
  tags?: string[];
  attachments?: string[];
  isArchived: boolean;
  progress?: number;
  createdBy: User;
  updatedBy?: User;
  createdAt: string;
  updatedAt: string;
}

export type NoteCategory = 'general' | 'personal' | 'work' | 'important' | 'idea';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  color?: string;
  isPinned: boolean;
  tags?: string[];
  owner: User;
  createdBy: User;
  updatedBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

export interface ListResponse<T> {
  status: string;
  data: Record<string, T[]> & {
    meta?: Pagination;
  };
}

export interface TaskStatistics {
  total: number;
  byStatus: {
    todo: number;
    inProgress: number;
    inReview: number;
    done: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  completed: number;
  overdue: number;
  withoutAssignee: number;
}

export interface NoteStatistics {
  total: number;
  byCategory: {
    general: number;
    personal: number;
    work: number;
    important: number;
    idea: number;
  };
  pinned: number;
}
