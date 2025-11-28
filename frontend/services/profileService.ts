import { StudentProfile } from '../types';

const API_URL = '/api/profile';

export const fetchProfile = async (): Promise<StudentProfile | null> => {
  const res = await fetch(API_URL, { credentials: 'include' });
  if (!res.ok) {
    throw new Error('Failed to fetch profile');
  }
  return await res.json();
};

export const saveProfile = async (profile: StudentProfile): Promise<StudentProfile> => {
  const res = await fetch(API_URL, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });

  if (!res.ok) {
    throw new Error('Failed to save profile');
  }

  return await res.json();
};

export const deleteProfile = async (): Promise<void> => {
  const res = await fetch(API_URL, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Failed to delete profile');
  }
};
