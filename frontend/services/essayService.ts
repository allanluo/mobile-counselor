import { Essay } from '../types';

const API_URL = '/api/essays';

const normalize = (item: any): Essay => ({
  id: item.id || item._id,
  collegeName: item.collegeName,
  prompt: item.prompt,
  content: item.content || '',
  lastEdited: item.lastEdited ? new Date(item.lastEdited) : new Date(),
  aiFeedback: item.aiFeedback || '',
});

export const fetchEssays = async (): Promise<Essay[]> => {
  const res = await fetch(API_URL, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch essays');
  const data = await res.json();
  return data.map(normalize);
};

export const createEssay = async (payload: { collegeName: string; prompt: string; content?: string; }): Promise<Essay> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create essay');
  return normalize(await res.json());
};

export const updateEssay = async (id: string, updates: Partial<Essay>): Promise<Essay> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update essay');
  return normalize(await res.json());
};

export const deleteEssay = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete essay');
};
