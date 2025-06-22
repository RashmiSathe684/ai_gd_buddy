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
    
    // Only initialize if no topics exist
    if (snapshot.empty) {
      const defaultTopics: Omit<GDTopic, 'id'>[] = [
        {
          title: 'Artificial Intelligence in Healthcare',
          description: 'Discuss the impact of AI on modern healthcare systems and patient care.',
          category: 'Technology',
          difficulty: 'Advanced',
          duration: '8-10 mins',
          participants: '4-6',
          popularity: 92,
          tags: ['AI', 'Healthcare', 'Ethics', 'Innovation'],
          keyPoints: [
            'AI diagnostic accuracy vs human expertise',
            'Privacy and security concerns',
            'Cost implications and accessibility',
            'Ethical considerations in AI decision-making'
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Climate Change Solutions',
          description: 'Explore sustainable approaches to combat climate change globally.',
          category: 'Environment',
          difficulty: 'Intermediate',
          duration: '6-8 mins',
          participants: '3-5',
          popularity: 88,
          tags: ['Environment', 'Sustainability', 'Policy', 'Global'],
          keyPoints: [
            'Renewable energy adoption',
            'Carbon footprint reduction strategies',
            'Government policies and regulations',
            'Individual vs collective responsibility'
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Digital Privacy Rights',
          description: 'Debate the balance between digital convenience and privacy protection.',
          category: 'Technology',
          difficulty: 'Advanced',
          duration: '7-9 mins',
          participants: '4-6',
          popularity: 85,
          tags: ['Privacy', 'Technology', 'Rights', 'Security'],
          keyPoints: [
            'Data collection by tech companies',
            'Government surveillance concerns',
            'User consent and awareness',
            'Regulatory frameworks needed'
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Future of Remote Work',
          description: 'Analyze the long-term implications of remote work on society and economy.',
          category: 'Business',
          difficulty: 'Intermediate',
          duration: '6-8 mins',
          participants: '3-5',
          popularity: 90,
          tags: ['Work', 'Technology', 'Society', 'Economy'],
          keyPoints: [
            'Work-life balance challenges',
            'Impact on urban development',
            'Technology infrastructure requirements',
            'Employee productivity and collaboration'
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Mental Health Awareness',
          description: 'Discuss strategies to improve mental health support in communities.',
          category: 'Health',
          difficulty: 'Beginner',
          duration: '5-7 mins',
          participants: '3-4',
          popularity: 86,
          tags: ['Health', 'Society', 'Support', 'Awareness'],
          keyPoints: [
            'Reducing stigma around mental health',
            'Accessible mental health services',
            'Role of social media and technology',
            'Community support systems'
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Cryptocurrency and Economy',
          description: 'Examine the role of digital currencies in the global financial system.',
          category: 'Business',
          difficulty: 'Advanced',
          duration: '8-10 mins',
          participants: '4-6',
          popularity: 82,
          tags: ['Finance', 'Technology', 'Economy', 'Innovation'],
          keyPoints: [
            'Cryptocurrency adoption and regulation',
            'Impact on traditional banking',
            'Environmental concerns of mining',
            'Financial inclusion opportunities'
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Social Media Impact on Youth',
          description: 'Analyze how social media platforms affect young people\'s development.',
          category: 'Society',
          difficulty: 'Intermediate',
          duration: '6-8 mins',
          participants: '4-5',
          popularity: 89,
          tags: ['Social Media', 'Youth', 'Psychology', 'Technology'],
          keyPoints: [
            'Mental health and self-esteem issues',
            'Cyberbullying and online safety',
            'Educational opportunities and resources',
            'Digital literacy and critical thinking'
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Sustainable Transportation',
          description: 'Discuss eco-friendly transportation solutions for urban areas.',
          category: 'Environment',
          difficulty: 'Intermediate',
          duration: '7-9 mins',
          participants: '4-6',
          popularity: 84,
          tags: ['Transportation', 'Environment', 'Urban Planning', 'Technology'],
          keyPoints: [
            'Electric vehicles vs public transport',
            'Infrastructure development needs',
            'Economic feasibility and costs',
            'Behavioral change and adoption'
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      // Add each topic to Firebase
      for (const topic of defaultTopics) {
        await addDoc(topicsRef, topic);
      }
      
      console.log('Default topics initialized in Firebase');
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