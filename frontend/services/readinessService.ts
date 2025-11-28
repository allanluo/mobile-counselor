import { ReadinessAssessment } from '../types';

const API_URL = '/api/readiness';

export const fetchReadiness = async (): Promise<ReadinessAssessment | null> => {
  const res = await fetch(API_URL, { credentials: 'include' });
  if (!res.ok) {
    throw new Error('Failed to fetch readiness');
  }
  return await res.json();
};

export const saveReadiness = async (assessment: ReadinessAssessment): Promise<ReadinessAssessment> => {
  const res = await fetch(API_URL, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assessment),
  });

  if (!res.ok) {
    throw new Error('Failed to save readiness');
  }

  return await res.json();
};
