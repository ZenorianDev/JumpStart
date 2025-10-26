// src/lib/contents.ts
export type ContentItem = {
  id: string;
  title: string;
  description: string;
  tags: string[]; // interests
  image: string;
};

export const CONTENTS: ContentItem[] = [
  {
    id: 'c1',
    title: 'AI for Product Designers',
    description: 'Practical ways to add AI features to product design and prototyping.',
    tags: ['AI', 'Design', 'Product'],
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&q=60&auto=format&fit=crop'
  },
  {
    id: 'c2',
    title: 'Home Gym Basics',
    description: 'Start your fitness journey with minimal equipment and big wins.',
    tags: ['Fitness', 'Health'],
    image:
      'https://images.unsplash.com/photo-1558611848-73f7eb4001d4?w=1000&q=60&auto=format&fit=crop'
  },
  {
    id: 'c3',
    title: 'Creative Photography Tips',
    description: 'Lighting, composition and post-processing advice for everyday photographers.',
    tags: ['Photography', 'Art'],
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000&q=60&auto=format&fit=crop'
  },
  {
    id: 'c4',
    title: 'Indie Game Dev Crash Course',
    description: 'How to ship your first small game—tools, workflows and lessons learned.',
    tags: ['Gaming', 'Programming'],
    image:
      'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=1000&q=60&auto=format&fit=crop'
  },
  {
    id: 'c5',
    title: 'Startup Fundamentals',
    description: 'From idea validation to traction—what early founders should learn first.',
    tags: ['Business', 'Product'],
    image:
      'https://images.unsplash.com/photo-1485217988980-11786ced9454?w=1000&q=60&auto=format&fit=crop'
  },
  {
    id: 'c6',
    title: 'Travel Photography',
    description: 'Best practices to tell a story through travel images and captions.',
    tags: ['Photography', 'Travel'],
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=60&auto=format&fit=crop'
  }
];

/** Canonical interests shown as tiles in the interest selector (display order) */
export const INTERESTS: string[] = [
  'AI',
  'Design',
  'Fitness',
  'Gaming',
  'Photography',
  'Business',
  'Travel',
  'Product',
  'Programming',
  'Health',
  'Art'
];
