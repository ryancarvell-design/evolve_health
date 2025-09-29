import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const SearchBar = ({ onSearch, onAdvancedToggle, showAdvanced }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');

  const handleSearch = (value) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      onSearch(searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  const searchTypes = [
    { value: 'all', label: 'All', icon: 'Search' },
    { value: 'patient', label: 'Patient ID', icon: 'User' },
    { value: 'document', label: 'Document Type', icon: 'FileText' },
    { value: 'content', label: 'Content', icon: 'FileSearch' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Icon 
            name="Search" 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <Input
            type="text"
            placeholder="Search documents, patients, or content..."
            value={searchQuery}
            onChange={(e) => handleSearch(e?.target?.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 pr-10 py-2.5 text-sm"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
            >
              <Icon name="X" size={16} />
            </button>
          )}
        </div>

        {/* Search Type Selector - Mobile Dropdown, Desktop Buttons */}
        <div className="flex items-center gap-2">
          {/* Mobile Dropdown */}
          <div className="sm:hidden flex-1">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e?.target?.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {searchTypes?.map((type) => (
                <option key={type?.value} value={type?.value}>
                  {type?.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden sm:flex items-center gap-1">
            {searchTypes?.map((type) => (
              <Button
                key={type?.value}
                variant={searchType === type?.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSearchType(type?.value)}
                className="text-xs"
              >
                <Icon name={type?.icon} size={14} className="mr-1" />
                {type?.label}
              </Button>
            ))}
          </div>

          {/* Advanced Filters Toggle */}
          <Button
            variant={showAdvanced ? 'default' : 'outline'}
            size="sm"
            onClick={onAdvancedToggle}
            className="whitespace-nowrap"
          >
            <Icon name="Filter" size={16} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </div>
      </div>

      {/* Quick Search Suggestions - Mobile */}
      <div className="mt-3 sm:hidden">
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1.5 bg-muted text-muted-foreground text-xs rounded-full hover:bg-muted/80 transition-colors">
            Recent documents
          </button>
          <button className="px-3 py-1.5 bg-muted text-muted-foreground text-xs rounded-full hover:bg-muted/80 transition-colors">
            My drafts
          </button>
          <button className="px-3 py-1.5 bg-muted text-muted-foreground text-xs rounded-full hover:bg-muted/80 transition-colors">
            Shared with me
          </button>
        </div>
      </div>

      {/* Search Results Summary */}
      {searchQuery && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Search results for "<span className="font-medium text-foreground">{searchQuery}</span>"
            <Button variant="link" size="sm" onClick={clearSearch} className="ml-2 p-0 h-auto text-xs">
              Clear
            </Button>
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;