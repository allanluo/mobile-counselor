const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

// We need to import the User model, assuming you have one.
// If you don't have a user.model.js, you can create a simple one.
// For now, let's assume a simple User model exists.
const User = require('./models/user.model'); // Assuming path to your user model
const Post = require('./models/post.model');

const MOCK_USERS_DATA = [
    { googleId: 'mock1', displayName: 'Kyler L.', email: 'kyler@example.com', role: 'ADMIN' },
    { googleId: 'mock2', displayName: 'Sarah P.', email: 'sarah@example.com' },
    { googleId: 'mock3', displayName: 'David C.', email: 'david@example.com' },
    { googleId: 'mock4', displayName: 'Emily R.', email: 'emily@example.com' },
    { googleId: 'mock5', displayName: 'Michael B.', email: 'michael@example.com' },
];

const IVY_LEAGUE_TOPICS = {
    titles: [
        "Chances for Harvard with a 3.8 GPA?",
        "Is my SAT score good enough for Yale?",
        "Best extracurriculars for Princeton admissions?",
        "How important is the Columbia supplemental essay?",
        "Cornell Engineering vs. UPenn Wharton",
        "What's the interview process like for Brown?",
        "Dartmouth - Is the rural location a pro or con?",
        "How to write a 'Why Harvard' essay that stands out?",
        "Are AP scores or GPA more important for Ivies?",
        "Tips for the Yale 'Short Takes' questions?",
    ],
    contents: [
        "I'm a junior with a 3.8 UW GPA and a 1520 SAT. I have strong extracurriculars in debate and volunteering. Realistically, what are my chances for getting into Harvard? Feeling a bit stressed.",
        "Just got my SAT score back - 1550. I'm aiming for Yale's humanities program. Is this competitive enough or should I retake?",
        "I'm trying to build my profile for Princeton. What kind of extracurriculars do they value most? Leadership in a few clubs or a wider range of activities?",
        "The Columbia supplemental essay seems really open-ended. Any advice on how to approach it without sounding generic? I'm applying for their Core Curriculum.",
        "I've been accepted to both Cornell for Engineering and UPenn for the Wharton School. I'm torn. Any insights on the culture and job prospects from either?",
        "I have an interview with a Brown alum next week. What kind of questions should I expect? Is it more of a personality check or a formal interview?",
        "I love the outdoors, so Dartmouth's location seems amazing, but I'm worried about internship opportunities. Can anyone speak to this?",
        "Everyone says the 'Why Us' essay is critical. How do I write a compelling 'Why Harvard' essay without just listing professors and classes?",
        "I have a 4.0 GPA but only a few AP scores (all 5s). My friend has a lower GPA but a ton of APs. What do Ivy League schools prefer to see?",
        "The Yale short answer questions are so short! How do you convey personality in just a few words? Any successful examples would be amazing.",
    ],
    replies: [
        "That's a great question. I'm in a similar boat.",
        "Following this thread.",
        "From what I've heard from admissions counselors, they really want to see demonstrated passion.",
        "Make sure you connect your experiences directly to what the university offers. Be specific!",
        "I wouldn't stress too much about a single metric. Your overall story matters more.",
        "Congratulations on those acceptances! Both are amazing schools.",
        "Have you visited the campus? That might help you decide.",
    ],
    categories: ["Academics", "Essays", "Campus Life", "Interviews", "Extracurriculars"],
};

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding...');

        // Clear existing data
        await User.deleteMany({ googleId: { $in: MOCK_USERS_DATA.map(u => u.googleId) } });
        await Post.deleteMany({}); // Deletes all posts
        console.log('Cleared old mock data.');

        // Create mock users
        const createdUsers = await User.insertMany(MOCK_USERS_DATA);
        console.log(`${createdUsers.length} mock users created.`);

        const postsToCreate = [];

        for (let i = 0; i < 50; i++) {
            const postAuthor = getRandomItem(createdUsers);
            const numReplies = Math.floor(Math.random() * 6); // 0 to 5 replies
            const postReplies = [];

            // Create a pool of potential repliers for this post to ensure uniqueness.
            // We filter out the post's original author so they don't reply to their own post.
            const potentialRepliers = createdUsers.filter(u => u.id !== postAuthor.id);

            for (let j = 0; j < numReplies; j++) {
                // If we've run out of unique repliers for this post, stop adding replies.
                if (potentialRepliers.length === 0) break;

                // Pick a random user from the pool of available repliers.
                const replierIndex = Math.floor(Math.random() * potentialRepliers.length);
                const replyAuthor = potentialRepliers[replierIndex];

                postReplies.push({
                    user: replyAuthor._id,
                    authorName: replyAuthor.displayName,
                    content: getRandomItem(IVY_LEAGUE_TOPICS.replies),
                });

                // Remove the selected user from the pool so they can't reply to this post again.
                potentialRepliers.splice(replierIndex, 1);
            }

            const newPost = {
                user: postAuthor._id,
                authorName: postAuthor.displayName,
                title: getRandomItem(IVY_LEAGUE_TOPICS.titles),
                content: getRandomItem(IVY_LEAGUE_TOPICS.contents),
                category: getRandomItem(IVY_LEAGUE_TOPICS.categories),
                likes: Math.floor(Math.random() * 25),
                aiReply: "This is a thoughtful question. Admissions committees often look for a holistic view of the applicant, so focusing on your unique story is key.",
                replies: postReplies,
            };
            postsToCreate.push(newPost);
        }

        await Post.insertMany(postsToCreate);
        console.log(`${postsToCreate.length} mock posts created successfully.`);

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
};

seedDatabase();