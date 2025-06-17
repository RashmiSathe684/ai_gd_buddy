import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Play, 
  Clock, 
  Users, 
  TrendingUp,
  BookOpen,
  Globe,
  Zap,
  Heart,
  Building,
  Gavel
} from 'lucide-react';

const TopicSelector: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const categories = [
    { name: 'All', icon: BookOpen, count: 48 },
    { name: 'Technology', icon: Zap, count: 12 },
    { name: 'Society', icon: Globe, count: 10 },
    { name: 'Health', icon: Heart, count: 8 },
    { name: 'Business', icon: Building, count: 9 },
    { name: 'Politics', icon: Gavel, count: 9 }
  ];

  const topics = [
    {
      id: 1,
      title: 'Artificial Intelligence in Healthcare',
      description: 'Discuss the impact of AI on modern healthcare systems and patient care.',
      category: 'Technology',
      difficulty: 'Advanced',
      duration: '8-10 mins',
      participants: '4-6',
      popularity: 92,
      tags: ['AI', 'Healthcare', 'Ethics', 'Innovation']
    },
    {
      id: 2,
      title: 'Climate Change Solutions',
      description: 'Explore sustainable approaches to combat climate change globally.',
      category: 'Society',
      difficulty: 'Intermediate',
      duration: '6-8 mins',
      participants: '3-5',
      popularity: 88,
      tags: ['Environment', 'Sustainability', 'Policy', 'Global']
    },
    {
      id: 3,
      title: 'Digital Privacy Rights',
      description: 'Debate the balance between digital convenience and privacy protection.',
      category: 'Technology',
      difficulty: 'Advanced',
      duration: '7-9 mins',
      participants: '4-6',
      popularity: 85,
      tags: ['Privacy', 'Technology', 'Rights', 'Security']
    },
    {
      id: 4,
      title: 'Future of Remote Work',
      description: 'Analyze the long-term implications of remote work on society and economy.',
      category: 'Business',
      difficulty: 'Intermediate',
      duration: '6-8 mins',
      participants: '3-5',
      popularity: 90,
      tags: ['Work', 'Technology', 'Society', 'Economy']
    },
    {
      id: 5,
      title: 'Mental Health Awareness',
      description: 'Discuss strategies to improve mental health support in communities.',
      category: 'Health',
      difficulty: 'Beginner',
      duration: '5-7 mins',
      participants: '3-4',
      popularity: 86,
      tags: ['Health', 'Society', 'Support', 'Awareness']
    },
    {
      id: 6,
      title: 'Cryptocurrency and Economy',
      description: 'Examine the role of digital currencies in the global financial system.',
      category: 'Business',
      difficulty: 'Advanced',
      duration: '8-10 mins',
      participants: '4-6',
      popularity: 82,
      tags: ['Finance', 'Technology', 'Economy', 'Innovation']
    }
  ];

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || topic.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || topic.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

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
                {categories.map(category => (
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
          {categories.map(category => {
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
                <div className="flex items-center space-x-1 text-gray-500">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">{topic.popularity}%</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {topic.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {topic.description}
              </p>

              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{topic.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{topic.participants}</span>
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

              <Link to={`/simulation/${topic.id}`}>
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

        {filteredTopics.length === 0 && (
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