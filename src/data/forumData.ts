import { ForumPost } from '../types';

export const initialForumPosts: ForumPost[] = [
  {
    id: 'post-1',
    authorAlias: 'WanderingSparrow',
    authorAvatarId: 'avatar-1',
    ageGroup: 'Young Adult (18-25)',
    title: 'Is it normal to feel like everyone else has their life sorted out except me?',
    content:
      'I am 22 and recently graduated. When I open social media, all my peers seem to be getting great jobs, moving to new cities, or starting ambitious ventures. I wake up with this heavy pit in my stomach feeling completely left behind. How do I stop comparing my behind-the-scenes with everyone else’s highlight reel?',
    category: 'Stress & Overthinking',
    likesCount: 38,
    repliesCount: 3,
    createdAt: '3 hours ago',
    replies: [
      {
        id: 'reply-1',
        authorAlias: 'Siddhi Patel',
        isMentor: true,
        content:
          'Dear WanderingSparrow, what you are feeling is one of the most common yet deeply silent burdens of early 20s. Remember: life is not a linear sprint where everyone starts at the same line with the same shoes. The anxiety you feel is not because you are behind—it is because you are comparing an internal experience of uncertainty with other people’s external curation. Take a deep breath today. Your pace is valid.',
        createdAt: '2 hours ago',
        likesCount: 29,
      },
      {
        id: 'reply-2',
        authorAlias: 'QuietObserver',
        isMentor: false,
        content:
          'I am 23 and felt the exact same thing last year. Deleting LinkedIn and Instagram for just two weeks gave me so much mental peace to focus on what I actually like doing.',
        createdAt: '1 hour ago',
        likesCount: 14,
      },
      {
        id: 'reply-3',
        authorAlias: 'Sunbeam99',
        isMentor: false,
        content: 'You are definitely not alone. I’m 24 and still figuring out my path. Sending you warmth!',
        createdAt: '45 mins ago',
        likesCount: 8,
      },
    ],
  },
  {
    id: 'post-2',
    authorAlias: 'Stargazer_17',
    authorAvatarId: 'avatar-2',
    ageGroup: 'Teen (12-17)',
    title: 'Terrified of letting my parents down with my stream selection',
    content:
      'I’m in 11th grade and my parents really want me to prepare for entrance exams, but I feel physically sick thinking about it. I enjoy writing, communication, and human stories. How can I talk to them without it turning into a screaming match?',
    category: 'Life Direction',
    likesCount: 52,
    repliesCount: 2,
    createdAt: 'Yesterday',
    replies: [
      {
        id: 'reply-4',
        authorAlias: 'Siddhi Patel',
        isMentor: true,
        content:
          'Hi Stargazer_17. It takes immense bravery to recognize what feels authentic to your spirit. Parents often express their underlying fear for your security as rigid expectations. When you approach them, begin not by attacking their choice, but by acknowledging their care: "I know you want the best future for me. Can I share what makes me feel alive and how we can make a plan together?" If you want, we can structure this conversation step-by-step.',
        createdAt: '18 hours ago',
        likesCount: 41,
      },
      {
        id: 'reply-5',
        authorAlias: 'FellowScholar',
        isMentor: false,
        content:
          'I was in your shoes 3 years ago. What helped was showing them concrete career paths in creative fields so they felt reassured about job stability.',
        createdAt: '14 hours ago',
        likesCount: 16,
      },
    ],
  },
  {
    id: 'post-3',
    authorAlias: 'MidnightThinker',
    authorAvatarId: 'avatar-3',
    ageGroup: 'Adult (26+)',
    title: 'The exhausting loop of overthinking every single email and conversation at work',
    content:
      'After every meeting, my brain replays every sentence I spoke: "Did I sound stupid?", "Did that person frown because of what I said?". By the time I reach home at 7 PM, I am emotionally drained before the evening even begins.',
    category: 'Stress & Overthinking',
    likesCount: 64,
    repliesCount: 2,
    createdAt: '2 days ago',
    replies: [
      {
        id: 'reply-6',
        authorAlias: 'Siddhi Patel',
        isMentor: true,
        content:
          'Overthinking is often a protective mechanism that our mind developed when we felt unsafe making mistakes in the past. Try this grounding question when the loop begins: "Is there concrete evidence for this thought right now, or is my brain trying to predict disaster to feel in control?" Giving your nervous system permission to be imperfect is the first step to peace.',
        createdAt: '1 day ago',
        likesCount: 48,
      },
      {
        id: 'reply-7',
        authorAlias: 'BreatheDeep',
        isMentor: false,
        content: 'This quote by Siddhi really hit home. Needed this reminder today.',
        createdAt: '1 day ago',
        likesCount: 12,
      },
    ],
  },
  {
    id: 'post-4',
    authorAlias: 'SeekingHorizon',
    authorAvatarId: 'avatar-4',
    ageGroup: 'Adult (26+)',
    title: 'Feeling emotionally numb after a long breakup. When does color come back to life?',
    content:
      'It has been 4 months. The sharp agony has faded, but in its place is just this grey emptiness where nothing excites me or bothers me. Has anyone else navigated this phase of healing?',
    category: 'Relationships',
    likesCount: 43,
    repliesCount: 1,
    createdAt: '3 days ago',
    replies: [
      {
        id: 'reply-8',
        authorAlias: 'Siddhi Patel',
        isMentor: true,
        content:
          'Numbness is not the absence of feeling; it is the body’s gentle shock absorber when the emotional volume was turned up too high for too long. Do not rush to feel ecstatic. Focus on small sensory anchors: the smell of warm tea, the warmth of the morning sun on your skin, a slow walk. Color returns quietly in micro-moments.',
        createdAt: '2 days ago',
        likesCount: 37,
      },
    ],
  },
];
