import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentlyViewed = ({ articles, onArticleClick }) => {
  if (!articles || articles?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recently Viewed</h3>
        <div className="text-center py-6">
          <Icon name="Clock" size={32} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            Articles you view will appear here for quick access
          </p>
        </div>
      </div>
    );
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const viewed = new Date(timestamp);
    const diffInHours = Math.floor((now - viewed) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - viewed) / (1000 * 60));
      return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const handleClearHistory = () => {
    if (confirm('Clear all recently viewed articles?')) {
      localStorage.removeItem('help-recent-articles');
      // In a real app, this would trigger a parent component update
      alert('Recently viewed articles cleared');
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recently Viewed</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearHistory}
          className="text-muted-foreground hover:text-foreground text-xs"
        >
          Clear
        </Button>
      </div>
      <div className="space-y-3">
        {articles?.map((article, index) => (
          <button
            key={`${article?.id}-${index}`}
            onClick={() => onArticleClick?.(article?.id, article?.title)}
            className="w-full p-3 rounded-md hover:bg-muted transition-clinical text-left group"
          >
            <div className="flex items-start space-x-3">
              <Icon name="Clock" size={16} className="text-muted-foreground mt-0.5" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-clinical truncate">
                  {article?.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {formatTimeAgo(article?.viewedAt)}
                </p>
              </div>
              <Icon 
                name="ChevronRight" 
                size={14} 
                className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" 
              />
            </div>
          </button>
        ))}
      </div>
      {/* Quick Bookmarks */}
      <div className="mt-4 pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-2">Quick Bookmarks</h4>
        <div className="space-y-2">
          {[
            'HIPAA Compliance Guidelines',
            'Voice Transcription Setup',
            'Emergency Procedures'
          ]?.map((bookmark, index) => (
            <button
              key={index}
              onClick={() => onArticleClick?.(`bookmark-${index}`, bookmark)}
              className="flex items-center w-full text-left py-1 text-sm text-muted-foreground hover:text-foreground transition-clinical"
            >
              <Icon name="Bookmark" size={14} className="mr-2" />
              {bookmark}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;