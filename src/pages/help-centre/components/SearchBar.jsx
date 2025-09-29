import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const SearchBar = ({ 
  searchQuery, 
  onSearch, 
  selectedCategory, 
  onCategoryChange 
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'getting-started', label: 'Getting Started' },
    { value: 'features', label: 'Feature Tutorials' },
    { value: 'healthcare', label: 'Healthcare Documentation' },
    { value: 'faqs', label: 'FAQs' },
    { value: 'troubleshooting', label: 'Troubleshooting' },
    { value: 'compliance', label: 'Compliance' }
  ];

  const healthcareSuggestions = [
    'HIPAA compliance requirements',
    'Patient data security',
    'Clinical workflow setup',
    'Medical template creation',
    'Healthcare team collaboration',
    'Voice transcription accuracy',
    'Patient portal integration',
    'Medical coding standards',
    'Audit trail documentation',
    'Emergency procedures documentation'
  ];

  const handleInputChange = (e) => {
    const value = e?.target?.value;
    setLocalQuery(value);

    // Show suggestions when user types
    if (value?.length > 2) {
      const filteredSuggestions = healthcareSuggestions?.filter(suggestion =>
        suggestion?.toLowerCase()?.includes(value?.toLowerCase())
      );
      setSuggestions(filteredSuggestions?.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleSearch = (query = localQuery) => {
    onSearch(query);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setLocalQuery(suggestion);
    handleSearch(suggestion);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="relative">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Search for help articles, guides, or FAQs..."
              value={localQuery}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-clinical"
            />
          </div>

          {/* Search Suggestions */}
          {showSuggestions && suggestions?.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-popover border border-border rounded-md shadow-clinical-lg z-50 mt-1">
              {suggestions?.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left text-sm text-popover-foreground hover:bg-muted transition-clinical flex items-center"
                >
                  <Icon name="Search" size={16} className="mr-3 text-muted-foreground" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="lg:w-64">
          <Select
            value={selectedCategory}
            onValueChange={onCategoryChange}
            options={categories}
            placeholder="Select category"
          />
        </div>

        {/* Search Button */}
        <Button 
          onClick={() => handleSearch()}
          className="px-8"
        >
          <Icon name="Search" size={16} className="mr-2" />
          Search
        </Button>
      </div>
      {/* Popular Searches */}
      <div className="mt-4">
        <p className="text-sm text-muted-foreground mb-2">Popular searches:</p>
        <div className="flex flex-wrap gap-2">
          {['HIPAA compliance', 'Voice transcription', 'Team collaboration', 'Template creation', 'Patient privacy']?.map((tag) => (
            <button
              key={tag}
              onClick={() => handleSuggestionClick(tag)}
              className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full hover:bg-accent hover:text-accent-foreground transition-clinical"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;