import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { db } from './firebase';

export interface GDTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  participants: string;
  popularity: number;
  tags: string[];
  keyPoints: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Initialize default topics in Firebase
export const initializeDefaultTopics = async (): Promise<void> => {
  try {
    const topicsRef = collection(db, 'topics');
    const snapshot = await getDocs(topicsRef);
    
    // Check if we need to reset/update the default topics in Firebase
    let needsReset = false;
    if (!snapshot.empty) {
      for (const doc of snapshot.docs) {
        const data = doc.data();
        // If the old topics or old participant count format is present, trigger reset
        if (data.title === 'Artificial Intelligence in Healthcare' || data.participants === '4-6' || data.participants === '3-5') {
          needsReset = true;
          break;
        }
      }
    }

    // Initialize or reset
    if (snapshot.empty || needsReset) {
      console.log('🔄 Syncing default topics in Firebase...');
      
      // Clear existing topics if we need a reset
      if (!snapshot.empty) {
        for (const doc of snapshot.docs) {
          await deleteDoc(doc.ref);
        }
      }

      const defaultTopics: Omit<GDTopic, 'id'>[] = [
        {
          title: 'Generative AI & Deepfakes: The Death of Digital Trust?',
          description: 'Debate the impact of generative AI and deepfakes on media integrity, cybersecurity, and public trust.',
          category: 'Technology',
          difficulty: 'Intermediate',
          duration: '6-8 mins',
          participants: '2-3',
          popularity: 95,
          tags: ['AI', 'Deepfakes', 'Ethics', 'Digital Trust'],
          keyPoints: [
            'Realism of AI-generated media vs detection capabilities',
            'Threat of deepfakes in elections and misinformation',
            'Identity theft and intellectual property concerns',
            'Regulatory frameworks and content authentication standards'
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Electric Vehicles: Green Future or Environmental Illusion?',
          description: 'Analyze whether switching to EVs is the ultimate solution to climate change or if it has hidden costs.',
          category: 'Environment',
          difficulty: 'Intermediate',
          duration: '6-8 mins',
          participants: '2-3',
          popularity: 88,
          tags: ['Environment', 'EVs', 'Sustainability', 'Technology'],
          keyPoints: [
            'Zero tailpipe emissions vs battery manufacturing pollution',
            'Lithium mining impact on communities and ecosystem',
            'Grid capability and source of charging electricity (coal vs solar)',
            'Recycling challenges of expired lithium-ion batteries'
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Social Media Algorithms: Freedom of Speech or Mind Control?',
          description: 'Debate the influence of AI recommendation engines on public opinion, polarization, and user addiction.',
          category: 'Technology',
          difficulty: 'Advanced',
          duration: '7-9 mins',
          participants: '2-3',
          popularity: 85,
          tags: ['Algorithms', 'Social Media', 'AI', 'Ethics'],
          keyPoints: [
            'Echo chambers and reinforcement of extreme viewpoints',
            'Ethical responsibility of tech giants to prevent addiction',
            'User privacy and monetization of personal behavioral data',
            'Government regulations vs platform censorship rights'
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'AI Automation: Will ChatGPT Take Our Jobs or Create New Ones?',
          description: 'Discuss the long-term impact of Large Language Models on white-collar professionals, education, and employment.',
          category: 'Business',
          difficulty: 'Intermediate',
          duration: '6-8 mins',
          participants: '2-3',
          popularity: 92,
          tags: ['AI', 'Jobs', 'Business', 'Future of Work'],
          keyPoints: [
            'Displacement of content creators, coders, and administrators',
            'Emergence of new roles like Prompt Engineers and AI Auditors',
            'Upskilling workforce to collaborate with AI assistants',
            'Economic inequality and the concept of Universal Basic Income'
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Social Media & Teen Mental Health: A Modern Crisis?',
          description: 'Discuss the link between screen time, social comparison, and rising anxiety levels in teenagers.',
          category: 'Health',
          difficulty: 'Beginner',
          duration: '5-7 mins',
          participants: '2-3',
          popularity: 86,
          tags: ['Mental Health', 'Teenagers', 'Social Media', 'Awareness'],
          keyPoints: [
            'Impact of likes and notifications on brain dopamine loops',
            'Cyberbullying and online peer pressure',
            'Curating perfect lifestyles vs real-world body image issues',
            'Strategies for digital detox and healthy online boundaries'
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'DeFi & Bitcoin: Future of Money or Financial Bubble?',
          description: 'Examine the role of decentralized finance and cryptocurrencies in replacing traditional banking.',
          category: 'Business',
          difficulty: 'Advanced',
          duration: '8-10 mins',
          participants: '2-3',
          popularity: 82,
          tags: ['Finance', 'Crypto', 'DeFi', 'Economy'],
          keyPoints: [
            'Decentralization and elimination of middlemen in transactions',
            'Extreme volatility and risks of investor speculation',
            'Central Bank Digital Currencies (CBDCs) vs public crypto',
            'Regulatory frameworks to prevent illegal financial activities'
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Cyberbullying and Digital Well-being on TikTok',
          description: 'Analyze how viral video platforms affect teen psychology, self-esteem, and social dynamics.',
          category: 'Society',
          difficulty: 'Intermediate',
          duration: '6-8 mins',
          participants: '2-3',
          popularity: 89,
          tags: ['TikTok', 'Society', 'Well-being', 'Psychology'],
          keyPoints: [
            'Short attention spans and addictive content delivery loops',
            'Spread of viral challenges that pose physical danger',
            'Online harassment, body shaming, and lack of content moderation',
            'Educational content and micro-learning opportunities'
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Smart Cities & Autonomous Cars: Are We Ready?',
          description: 'Discuss the technological, ethical, and infrastructure readiness for self-driving vehicles on public roads.',
          category: 'Environment',
          difficulty: 'Intermediate',
          duration: '7-9 mins',
          participants: '2-3',
          popularity: 84,
          tags: ['Smart Cities', 'Autonomous Cars', 'Technology', 'Safety'],
          keyPoints: [
            'Reduction of traffic accidents vs AI decision errors',
            'The "Trolley Problem": Ethical choices in unavoidable crashes',
            'Infrastructure and 5G network requirements for smart traffic',
            'Impact on taxi, bus, and truck driver employment'
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      // Add each topic to Firebase
      for (const topic of defaultTopics) {
        await addDoc(topicsRef, topic);
      }
      
      console.log('✅ Trendy topics initialized in Firebase');
    }
  } catch (error) {
    console.error('Error initializing default topics:', error);
  }
};

// Get all topics from Firebase
export const getAllTopics = async (): Promise<GDTopic[]> => {
  try {
    const topicsRef = collection(db, 'topics');
    const q = query(topicsRef, orderBy('popularity', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as GDTopic[];
  } catch (error) {
    console.error('Error fetching topics:', error);
    return [];
  }
};

// Get topic by ID
export const getTopicById = async (topicId: string): Promise<GDTopic | null> => {
  try {
    const topicRef = doc(db, 'topics', topicId);
    const topicDoc = await getDoc(topicRef);
    
    if (topicDoc.exists()) {
      return {
        id: topicDoc.id,
        ...topicDoc.data()
      } as GDTopic;
    }
    return null;
  } catch (error) {
    console.error('Error fetching topic:', error);
    return null;
  }
};

// Get topics by category
export const getTopicsByCategory = async (category: string): Promise<GDTopic[]> => {
  try {
    const topicsRef = collection(db, 'topics');
    const q = query(
      topicsRef, 
      where('category', '==', category),
      orderBy('popularity', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as GDTopic[];
  } catch (error) {
    console.error('Error fetching topics by category:', error);
    return [];
  }
};

// Get topics by difficulty
export const getTopicsByDifficulty = async (difficulty: string): Promise<GDTopic[]> => {
  try {
    const topicsRef = collection(db, 'topics');
    const q = query(
      topicsRef, 
      where('difficulty', '==', difficulty),
      orderBy('popularity', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as GDTopic[];
  } catch (error) {
    console.error('Error fetching topics by difficulty:', error);
    return [];
  }
};

// Add new topic
export const addTopic = async (topicData: Omit<GDTopic, 'id'>): Promise<string> => {
  try {
    const topicsRef = collection(db, 'topics');
    const docRef = await addDoc(topicsRef, {
      ...topicData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding topic:', error);
    throw error;
  }
};

// Update topic
export const updateTopic = async (topicId: string, updates: Partial<GDTopic>): Promise<void> => {
  try {
    const topicRef = doc(db, 'topics', topicId);
    await updateDoc(topicRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating topic:', error);
    throw error;
  }
};

// Delete topic
export const deleteTopic = async (topicId: string): Promise<void> => {
  try {
    const topicRef = doc(db, 'topics', topicId);
    await deleteDoc(topicRef);
  } catch (error) {
    console.error('Error deleting topic:', error);
    throw error;
  }
};

// Search topics
export const searchTopics = async (searchTerm: string): Promise<GDTopic[]> => {
  try {
    const allTopics = await getAllTopics();
    const searchLower = searchTerm.toLowerCase();
    
    return allTopics.filter(topic => 
      topic.title.toLowerCase().includes(searchLower) ||
      topic.description.toLowerCase().includes(searchLower) ||
      topic.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      topic.category.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error('Error searching topics:', error);
    return [];
  }
};

// Update topic popularity (when selected)
export const incrementTopicPopularity = async (topicId: string): Promise<void> => {
  try {
    const topic = await getTopicById(topicId);
    if (topic) {
      await updateTopic(topicId, {
        popularity: Math.min(100, topic.popularity + 1)
      });
    }
  } catch (error) {
    console.error('Error updating topic popularity:', error);
  }
};