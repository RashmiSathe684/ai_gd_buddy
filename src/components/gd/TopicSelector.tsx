import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Play, 
  Users, 
  BookOpen,
  Globe,
  Zap,
  Heart,
  Building,
  Gavel,
  Leaf,
  Brain,
  RefreshCw
} from 'lucide-react';
import { 
  getAllTopics, 
  initializeDefaultTopics, 
  incrementTopicPopularity,
  GDTopic 
} from '../../services/topicsService';
import toast from 'react-hot-toast';

const TopicSelector: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [topics, setTopics] = useState<GDTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { name: 'All', icon: BookOpen, count: 0 },
    { name: 'Technology', icon: Zap, count: 0 },
    { name: 'Society', icon: Globe, count: 0 },
    { name: 'Health', icon: Heart, count: 0 },
    { name: 'Business', icon: Building, count: 0 },
    { name: 'Politics', icon: Gavel, count: 0 },
    { name: 'Environment', icon: Leaf, count: 0 }
  ];

  // Load topics from Firebase
  useEffect(() => {
    const loadTopics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Initialize default topics if needed
        await initializeDefaultTopics();
        
        // Fetch all topics
        const fetchedTopics = await getAllTopics();
        setTopics(fetchedTopics);
        
        if (fetchedTopics.length === 0) {
          setError('No topics available. Please check your Firebase connection.');
        }
      } catch (err) {
        console.error('Error loading topics:', err);
        setError('Failed to load topics. Please try again.');
        toast.error('Failed to load topics from database');
      } finally {
        setLoading(false);
      }
    };

    loadTopics();
  }, []);

  // Update category counts
  const categoriesWithCounts = categories.map(category => ({
    ...category,
    count: category.name === 'All' 
      ? topics.length 
      : topics.filter(topic => topic.category === category.name).length
  }));

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || topic.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || topic.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleTopicSelect = async (topicId: string) => {
    try {
      // Increment popularity when topic is selected
      await incrementTopicPopularity(topicId);
      toast.success('Topic selected! Starting session...');
    } catch (error) {
      console.error('Error updating topic popularity:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const retryLoading = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTopics = await getAllTopics();
      setTopics(fetchedTopics);
    } catch (err) {
      setError('Failed to load topics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Topics...</h2>
          <p className="text-gray-600">Fetching discussion topics from database</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Brain className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Topics</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={retryLoading}
            className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-all duration-200 mx-auto"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Retry Loading</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Discussion Topic
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select from our curated collection of engaging topics designed to enhance your group discussion skills
          </p>
          <div className="mt-4 text-sm text-gray-500">
            {topics.length} topics available • Powered by Firebase
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 appearance-none"
              >
                {categoriesWithCounts.map(category => (
                  <option key={category.name} value={category.name}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="relative">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 appearance-none"
              >
                <option value="All">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Category Pills */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-3 justify-center">
          {categoriesWithCounts.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                  selectedCategory === category.name
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white/70 text-gray-700 hover:bg-white/90 hover:shadow-md'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{category.name}</span>
                <span className="text-xs opacity-75">({category.count})</span>
              </button>
            );
          })}
        </motion.div>

        {/* Topics Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTopics.map(topic => (
            <motion.div
              key={topic.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(topic.difficulty)}`}>
                  {topic.difficulty}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {topic.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {topic.description}
              </p>

              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{topic.participants} participants</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {topic.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
                {topic.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                    +{topic.tags.length - 3}
                  </span>
                )}
              </div>

              <Link 
                to={`/simulation/${topic.id}`}
                onClick={() => handleTopicSelect(topic.id)}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>Start Discussion</span>
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {filteredTopics.length === 0 && !loading && (
          <motion.div
            variants={itemVariants}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No topics found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TopicSelector;