import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const HelpSections = ({ searchQuery, selectedCategory, onArticleView }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const helpSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Everything you need to know to begin using Evolve Health',
      icon: 'BookOpen',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      articles: [
        { id: 'gs1', title: 'Account Setup and First Login', readTime: '5 min', popular: true },
        { id: 'gs2', title: 'Understanding the Dashboard', readTime: '8 min' },
        { id: 'gs3', title: 'Creating Your First Document', readTime: '10 min', popular: true },
        { id: 'gs4', title: 'Setting Up Your Profile', readTime: '6 min' },
        { id: 'gs5', title: 'Inviting Team Members', readTime: '7 min' }
      ]
    },
    {
      id: 'features',
      title: 'Feature Tutorials',
      description: 'Learn how to use specific features and tools',
      icon: 'Zap',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      articles: [
        { id: 'ft1', title: 'AI Documentation Assistant', readTime: '12 min', popular: true },
        { id: 'ft2', title: 'Voice Transcription Setup', readTime: '9 min', popular: true },
        { id: 'ft3', title: 'Template Creation and Management', readTime: '15 min' },
        { id: 'ft4', title: 'Real-time Collaboration Tools', readTime: '11 min' },
        { id: 'ft5', title: 'Advanced Search and Filters', readTime: '8 min' },
        { id: 'ft6', title: 'Document Version Control', readTime: '10 min' }
      ]
    },
    {
      id: 'healthcare',
      title: 'Healthcare Documentation',
      description: 'Industry-specific guides and best practices',
      icon: 'Heart',
      color: 'text-error',
      bgColor: 'bg-error/10',
      articles: [
        { id: 'hc1', title: 'HIPAA Compliance Guidelines', readTime: '20 min', popular: true },
        { id: 'hc2', title: 'Clinical Workflow Best Practices', readTime: '18 min' },
        { id: 'hc3', title: 'Patient Data Security Protocols', readTime: '16 min', popular: true },
        { id: 'hc4', title: 'Medical Coding Integration', readTime: '14 min' },
        { id: 'hc5', title: 'Audit Trail Documentation', readTime: '12 min' },
        { id: 'hc6', title: 'Emergency Documentation Procedures', readTime: '10 min' }
      ]
    },
    {
      id: 'faqs',
      title: 'Frequently Asked Questions',
      description: 'Answers to common questions',
      icon: 'HelpCircle',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      articles: [
        { id: 'faq1', title: 'Account and Billing Questions', readTime: '3 min', popular: true },
        { id: 'faq2', title: 'Security and Privacy FAQs', readTime: '5 min' },
        { id: 'faq3', title: 'Integration Questions', readTime: '4 min' },
        { id: 'faq4', title: 'Mobile App Usage', readTime: '3 min' },
        { id: 'faq5', title: 'Troubleshooting Common Issues', readTime: '6 min', popular: true }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      description: 'Solutions for technical issues',
      icon: 'Settings',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      articles: [
        { id: 'ts1', title: 'Login and Authentication Issues', readTime: '7 min', popular: true },
        { id: 'ts2', title: 'Document Loading Problems', readTime: '5 min' },
        { id: 'ts3', title: 'Voice Transcription Not Working', readTime: '8 min' },
        { id: 'ts4', title: 'Collaboration Sync Issues', readTime: '6 min' },
        { id: 'ts5', title: 'Performance and Speed Issues', readTime: '9 min' }
      ]
    },
    {
      id: 'video-library',
      title: 'Video Tutorial Library',
      description: 'Comprehensive video guides and walkthroughs',
      icon: 'PlayCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      articles: [
        { id: 'vl1', title: 'Complete Platform Overview', readTime: '25 min', popular: true },
        { id: 'vl2', title: 'Advanced AI Features', readTime: '18 min' },
        { id: 'vl3', title: 'Team Management Tutorial', readTime: '15 min' },
        { id: 'vl4', title: 'Mobile App Walkthrough', readTime: '12 min' },
        { id: 'vl5', title: 'Integration Setup Guide', readTime: '20 min' }
      ]
    }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const handleArticleClick = (article, sectionTitle) => {
    onArticleView?.(article?.id, article?.title);
    // In a real app, this would navigate to the article page
    alert(`Opening: ${article?.title}\nFrom: ${sectionTitle}`);
  };

  // Filter sections based on search and category
  const filteredSections = helpSections?.filter(section => {
    if (selectedCategory !== 'all' && section?.id !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      return section?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
             section?.articles?.some(article => 
               article?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase())
             );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">Help Topics</h2>
      {filteredSections?.map((section) => (
        <div key={section?.id} className="bg-card border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection(section?.id)}
            className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-clinical"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-lg ${section?.bgColor} flex items-center justify-center`}>
                <Icon name={section?.icon} size={24} className={section?.color} />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-foreground">{section?.title}</h3>
                <p className="text-muted-foreground">{section?.description}</p>
                <span className="text-sm text-muted-foreground">
                  {section?.articles?.length} articles
                </span>
              </div>
            </div>
            <Icon 
              name="ChevronDown" 
              size={20} 
              className={`text-muted-foreground transition-transform ${
                expandedSection === section?.id ? 'rotate-180' : ''
              }`} 
            />
          </button>

          {expandedSection === section?.id && (
            <div className="border-t border-border">
              <div className="p-6 pt-0">
                <div className="grid gap-3 mt-4">
                  {section?.articles?.filter(article => 
                      !searchQuery || article?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase())
                    )?.map((article) => (
                    <button
                      key={article?.id}
                      onClick={() => handleArticleClick(article, section?.title)}
                      className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-clinical text-left group"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon name="FileText" size={16} className="text-muted-foreground" />
                        <div>
                          <span className="text-foreground group-hover:text-primary transition-clinical">
                            {article?.title}
                          </span>
                          {article?.popular && (
                            <span className="ml-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{article?.readTime}</span>
                        <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      {filteredSections?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No results found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or browse all categories
          </p>
        </div>
      )}
    </div>
  );
};

export default HelpSections;