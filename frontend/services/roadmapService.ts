import { RoadmapItem } from '../types';

const API_URL = '/api/roadmap';

export type RoadmapPayload = Partial<Omit<RoadmapItem, 'id'>> & { title: string };

const normalize = (task: any): RoadmapItem => ({
  id: task.id || task._id,
  title: task.title,
  description: task.description || '',
  status: task.status || 'pending',
  date: task.date || 'TBD',
  category: task.category || 'application',
});

export const fetchRoadmap = async (): Promise<RoadmapItem[]> => {
  const res = await fetch(API_URL, { credentials: 'include' });
  if (!res.ok) {
    throw new Error('Failed to load roadmap');
  }
  const data = await res.json();
  return data.map(normalize);
};

export const createTask = async (payload: RoadmapPayload): Promise<RoadmapItem> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to create task');
  }

  return normalize(await res.json());
};

export const updateTask = async (id: string, updates: Partial<RoadmapItem>): Promise<RoadmapItem> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    throw new Error('Failed to update task');
  }

  return normalize(await res.json());
};

export const deleteTask = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to delete task');
  }
};

export const replaceTasks = async (tasks: RoadmapPayload[]): Promise<RoadmapItem[]> => {
  const res = await fetch(`${API_URL}/bulk`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tasks }),
  });

  if (!res.ok) {
    throw new Error('Failed to replace tasks');
  }

  const data = await res.json();
  return data.map(normalize);
};
