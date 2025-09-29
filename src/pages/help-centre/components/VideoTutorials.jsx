import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VideoTutorials = ({ onVideoView }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const videoCategories = [
    { value: 'all', label: 'All Videos' },
    { value: 'getting-started', label: 'Getting Started' },
    { value: 'advanced', label: 'Advanced Features' },
    { value: 'healthcare', label: 'Healthcare Specific' },
    { value: 'troubleshooting', label: 'Troubleshooting' }
  ];

  const videoTutorials = [
    {
      id: 'v1',
      title: 'Getting Started with Evolve Health',
      description: 'Complete walkthrough for new users',
      thumbnail: '/api/placeholder/300/200',
      duration: '15:32',
      views: '12.5k',
      category: 'getting-started',
      level: 'Beginner',
      popular: true
    },
    {
      id: 'v2',
      title: 'AI Documentation Assistant Deep Dive',
      description: 'Learn advanced AI features and customization',
      thumbnail: '/api/placeholder/300/200',
      duration: '22:18',
      views: '8.7k',
      category: 'advanced',
      level: 'Advanced',
      popular: true
    },
    {
      id: 'v3',
      title: 'HIPAA Compliance Setup',
      description: 'Ensure your practice meets all requirements',
      thumbnail: '/api/placeholder/300/200',
      duration: '18:45',
      views: '15.2k',
      category: 'healthcare',
      level: 'Intermediate',
      popular: true
    },
    {
      id: 'v4',
      title: 'Voice Transcription Best Practices',
      description: 'Optimize accuracy for medical terminology',
      thumbnail: '/api/placeholder/300/200',
      duration: '12:30',
      views: '9.3k',
      category: 'healthcare',
      level: 'Intermediate'
    },
    {
      id: 'v5',
      title: 'Team Collaboration Features',
      description: 'Maximize productivity with team tools',
      thumbnail: '/api/placeholder/300/200',
      duration: '16:20',
      views: '6.8k',
      category: 'advanced',
      level: 'Intermediate'
    },
    {
      id: 'v6',
      title: 'Troubleshooting Common Issues',
      description: 'Quick fixes for the most common problems',
      thumbnail: '/api/placeholder/300/200',
      duration: '14:15',
      views: '11.1k',
      category: 'troubleshooting',
      level: 'Beginner'
    }
  ];

  const filteredVideos = videoTutorials?.filter(video => 
    selectedCategory === 'all' || video?.category === selectedCategory
  );

  const handleVideoPlay = (video) => {
    onVideoView?.(video?.id, video?.title);
    // In a real app, this would open a video player modal or navigate to video page
    alert(`Playing: ${video?.title}\nDuration: ${video?.duration}\nLevel: ${video?.level}`);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-success/10 text-success';
      case 'Intermediate':
        return 'bg-warning/10 text-warning';
      case 'Advanced':
        return 'bg-error/10 text-error';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="mt-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-4 sm:mb-0">Video Tutorials</h2>
        
        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={16} className="text-muted-foreground" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e?.target?.value)}
            className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {videoCategories?.map(category => (
              <option key={category?.value} value={category?.value}>
                {category?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos?.map((video) => (
          <div key={video?.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-clinical-md transition-all group">
            {/* Video Thumbnail */}
            <div className="relative">
              <div className="w-full h-48 bg-muted flex items-center justify-center relative overflow-hidden">
                {/* Placeholder for video thumbnail */}
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Icon name="Play" size={32} className="text-primary" />
                </div>
                
                {/* Duration Overlay */}
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
                  {video?.duration}
                </div>

                {/* Popular Badge */}
                {video?.popular && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                    Popular
                  </div>
                )}

                {/* Play Button Overlay */}
                <button
                  onClick={() => handleVideoPlay(video)}
                  className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors"
                >
                  <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all">
                    <Icon name="Play" size={24} className="text-primary-foreground ml-1" />
                  </div>
                </button>
              </div>
            </div>

            {/* Video Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {video?.title}
                </h3>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {video?.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(video?.level)}`}>
                    {video?.level}
                  </span>
                  <span className="text-xs text-muted-foreground">{video?.views} views</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVideoPlay(video)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Icon name="Play" size={16} className="mr-1" />
                  Watch
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* View All Videos Button */}
      <div className="text-center mt-8">
        <Button 
          variant="outline"
          onClick={() => alert('Full video library would open here')}
        >
          <Icon name="PlayCircle" size={16} className="mr-2" />
          View All {videoTutorials?.length} Videos
        </Button>
      </div>
    </div>
  );
};

export default VideoTutorials;