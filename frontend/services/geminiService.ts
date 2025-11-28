import { StudentProfile, SampleProfile, ChatMessage, ReadinessAssessment, College, Scholarship, TrainingResource } from '../types';
import { MOCK_SAMPLE_PROFILES, MOCK_TRAINING, MOCK_COLLEGES, MOCK_SCHOLARSHIPS } from '../constants';

// This is a placeholder for your actual Gemini API call logic.
// You would replace the mock implementation with a real API call.
const callGeminiAPI = async (prompt: string): Promise<any> => {
    console.log("--- Sending Prompt to Gemini ---");
    console.log(prompt);
    console.log("---------------------------------");
    // In a real application, you would make a fetch request to your backend
    // which then calls the Gemini API.
    // For now, we'll return a mock response.
    // This simulates finding one or two profiles from the mock data.
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                successStories: MOCK_SAMPLE_PROFILES.slice(0, 2).map(p => ({...p, hook: `AI-matched for query.`}))
            });
        }, 1000);
    });
};

/**
 * Finds success stories based on a search term and user profile.
 */
export const findSuccessStories = async (searchTerm: string, profile: StudentProfile): Promise<SampleProfile[]> => {
    const baseUnis = ['Harvard University', 'MIT', 'Yale University', 'Princeton University', 'Columbia University', 'UC Berkeley', 'Caltech'];
    const query = searchTerm.trim() || 'top universities';
    const major = profile.intendedMajors?.[0] || 'Computer Science';
    const interests = profile.interests?.slice(0, 2).join(', ') || 'STEM leadership';
    const satValues = ['1580', '1570', '1560', '1550', '1540', '1530', '1520'];
    const gpaValues = ['4.0 UW', '3.98 UW', '3.95 UW', '3.92 UW', '3.90 UW', '3.88 UW', '3.85 UW'];
    const hooks = [
        'Built a civic-tech app adopted by the city council',
        'Published AI research in a high-school journal',
        'Founded a tutoring nonprofit serving 200+ students',
        'Led a robotics team to nationals with an original vision system',
        'Launched a sustainability initiative reducing waste by 30%',
        'Created an accessibility tool for dyslexia used by local schools',
        'Co-authored an open-source library with 5k stars'
    ];
    const snippets = [
        'I learned that code can change policy when a council member called to implement my app.',
        'Staying up to debug a model taught me persistence beyond grades.',
        'Teaching Python on a borrowed projector showed me the power of community.',
        'Our robot failed in practice—then our vision rewrite put us on the podium.',
        'Measuring trash day after day became a meditation on impact.',
        'Watching a classmate read fluently for the first time changed my trajectory.',
        'Seeing strangers fork my code was the moment I felt part of a larger world.'
    ];

    const shuffledUnis = [...baseUnis].sort(() => Math.random() - 0.5);
    const shuffledHooks = [...hooks].sort(() => Math.random() - 0.5);
    const shuffledSnippets = [...snippets].sort(() => Math.random() - 0.5);
    const shuffledGpa = [...gpaValues].sort(() => Math.random() - 0.5);
    const shuffledSat = [...satValues].sort(() => Math.random() - 0.5);

    return shuffledUnis.slice(0, 4).map((uni, i) => ({
        id: `story-${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}`,
        university: uni,
        year: new Date().getFullYear() - Math.floor(Math.random() * 2), // vary between current and last year
        major,
        stats: `GPA ${shuffledGpa[i % shuffledGpa.length]} • SAT ${shuffledSat[i % shuffledSat.length]}`,
        hook: `${shuffledHooks[i % shuffledHooks.length]} (aligned to "${query}")`,
        essaySnippet: `${shuffledSnippets[i % shuffledSnippets.length]}`,
        fullEssay: `I pursued ${query} through ${interests}. ${shuffledSnippets[i % shuffledSnippets.length]} That experience convinced me to study ${major} at institutions like ${uni}, where I can scale this impact.`,
    }));
};

export const findTrainingResources = async (profile: StudentProfile, searchTerm: string): Promise<TrainingResource[]> => {
    const prompt = `For a student with profile ${JSON.stringify(profile)}, find training resources about "${searchTerm}".`;
    console.log('findTrainingResources prompt:', prompt);
    // Mock implementation
    return new Promise(resolve => setTimeout(() => resolve(MOCK_TRAINING.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()))), 500));
};

export const critiqueEssay = async (prompt: string, content: string): Promise<string> => {
    const apiPrompt = `Critique this essay based on the prompt.\n\nPROMPT: ${prompt}\n\nESSAY:\n${content}`;
    console.log('critiqueEssay prompt:', apiPrompt);
    // Mock implementation
    return new Promise(resolve => setTimeout(() => resolve("This is a solid start. Consider strengthening your opening paragraph to grab the reader's attention. Also, try to show, not just tell, by using more vivid examples from your experiences."), 1000));
};

export const findEssayPrompts = async (college: string): Promise<string[]> => {
    const prompt = `Find the latest Common App and supplemental essay prompts for ${college}.`;
    console.log('findEssayPrompts prompt:', prompt);
    // Mock implementation
    return new Promise(resolve => setTimeout(() => resolve([
        `Discuss an accomplishment, event, or realization that sparked a period of personal growth for ${college}.`,
        `What do you hope to study at ${college}?`
    ]), 500));
};

export const getGeminiChatResponse = async (history: ChatMessage[], text: string, profile: StudentProfile, persona?: string): Promise<string> => {
    const prompt = `
        Persona: ${persona || 'You are a helpful and expert college admissions counselor.'}
        Student Profile: ${JSON.stringify(profile)}
        Chat History: ${JSON.stringify(history)}
        New User Message: "${text}"
        Your Response:
    `;
    console.log('getGeminiChatResponse prompt:', prompt);
    // Mock implementation
    return new Promise(resolve => setTimeout(() => resolve(`Thinking about "${text}", based on your profile, I'd suggest focusing on your extracurriculars.`), 1000));
};

export const analyzeProfile = async (profile: StudentProfile): Promise<string> => {
    const prompt = `Analyze this student profile: ${JSON.stringify(profile)}. Provide a SWOT analysis.`;
    console.log('analyzeProfile prompt:', prompt);
    // Mock implementation
    return new Promise(resolve => setTimeout(() => resolve("### Strengths\n- Strong GPA\n\n### Weaknesses\n- Lack of leadership roles\n\n### Opportunities\n- Summer research programs\n\n### Threats\n- Highly competitive applicant pool for desired major"), 1000));
};

export const assessReadiness = async (profile: StudentProfile): Promise<ReadinessAssessment> => {
    const prompt = `Assess college readiness for this profile: ${JSON.stringify(profile)}.`;
    console.log('assessReadiness prompt:', prompt);
    // Mock implementation
    return new Promise(resolve => setTimeout(() => resolve({
        overallScore: 78,
        academicScore: 85,
        extracurricularScore: 70,
        fitScore: 80,
        strengths: ["High GPA", "Strong test scores"],
        weaknesses: ["Limited volunteer hours"],
        actionableSteps: ["Find a local non-profit to volunteer with", "Take on a leadership role in a club"]
    }), 1000));
};

export const generateRoadmap = async (profile: StudentProfile): Promise<{ milestones: any[] }> => {
    const prompt = `Generate a college application roadmap for this student: ${JSON.stringify(profile)}.`;
    console.log('generateRoadmap prompt:', prompt);
    // Mock implementation
    return new Promise(resolve => setTimeout(() => resolve({
        milestones: [
            { title: "Research 10 colleges", timeline: "Month 1" },
            { title: "Draft personal statement", timeline: "Month 2" }
        ]
    }), 1000));
};

export const findScholarships = async (profile: StudentProfile, criteria: string): Promise<Scholarship[]> => {
    const prompt = `For student ${JSON.stringify(profile)}, find scholarships for "${criteria}".`;
    console.log('findScholarships prompt:', prompt);
    // Mock implementation
    return new Promise(resolve => setTimeout(() => resolve(MOCK_SCHOLARSHIPS.slice(0, 2)), 1000));
};

export const findColleges = async (profile: StudentProfile, criteria: string): Promise<College[]> => {
    const prompt = `For student ${JSON.stringify(profile)}, find colleges for "${criteria}".`;
    console.log('findColleges prompt:', prompt);
    // Mock implementation
    return new Promise(resolve => setTimeout(() => resolve(MOCK_COLLEGES.slice(0, 3)), 1000));
};

export const generateSampleEssay = async (prompt: string, profile: StudentProfile): Promise<string> => {
    const apiPrompt = `Write a sample essay for a student like this: ${JSON.stringify(profile)} for the prompt: "${prompt}"`;
    console.log('generateSampleEssay prompt:', apiPrompt);
    // Mock implementation
    return new Promise(resolve => setTimeout(() => resolve("Here is a sample essay that starts with a compelling story..."), 1000));
};

export const getInterviewQuestion = async (history: ChatMessage[], profile: StudentProfile): Promise<string> => {
    const prompt = `
        You are a mock interviewer for ${profile.dreamColleges[0] || 'a top university'}.
        Ask the next logical interview question based on the chat history.
        History: ${JSON.stringify(history)}
    `;
    console.log('getInterviewQuestion prompt:', prompt);
    // Mock implementation
    return new Promise(resolve => setTimeout(() => resolve("Tell me about a time you faced a challenge in a team project."), 500));
};

export const replyToForumPost = async (title: string, content: string): Promise<string> => {
    const prompt = `
        As an AI college counselor, provide a helpful, concise reply to this forum post.
        Title: ${title}
        Content: ${content}
    `;
    console.log('replyToForumPost prompt:', prompt);
    // Mock implementation
    return new Promise(resolve => setTimeout(() => resolve("That's a great question! Many students wonder about that. I'd suggest looking into the university's specific program page and reaching out to current students on LinkedIn."), 1000));
};
