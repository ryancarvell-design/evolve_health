import React, { useState } from 'react';
        import Button from '../../../components/ui/Button';
        
        import Select from '../../../components/ui/Select';
        import Icon from '../../../components/AppIcon';

        const AdvancedFilters = ({ onFilterChange }) => {
          const [filters, setFilters] = useState({
            dateRange: '',
            specialty: '',
            documentCount: '',
            createdBy: '',
            lastActivityRange: ''
          });

          const handleFilterChange = (key, value) => {
            const updatedFilters = { ...filters, [key]: value };
            setFilters(updatedFilters);
            onFilterChange?.(updatedFilters);
          };

          const handleReset = () => {
            const resetFilters = {
              dateRange: '',
              specialty: '',
              documentCount: '',
              createdBy: '',
              lastActivityRange: ''
            };
            setFilters(resetFilters);
            onFilterChange?.(resetFilters);
          };

          const dateRangeOptions = [
            { value: '', label: 'Any time' },
            { value: 'today', label: 'Today' },
            { value: 'week', label: 'This week' },
            { value: 'month', label: 'This month' },
            { value: 'quarter', label: 'This quarter' },
            { value: 'year', label: 'This year' }
          ];

          const specialtyOptions = [
            { value: '', label: 'All specialties' },
            { value: 'Physical Therapy', label: 'Physical Therapy' },
            { value: 'Occupational Therapy', label: 'Occupational Therapy' },
            { value: 'Speech Therapy', label: 'Speech Therapy' },
            { value: 'General Medicine', label: 'General Medicine' },
            { value: 'Cardiology', label: 'Cardiology' },
            { value: 'Orthopedics', label: 'Orthopedics' }
          ];

          const documentCountOptions = [
            { value: '', label: 'Any count' },
            { value: '0', label: 'No documents' },
            { value: '1-5', label: '1-5 documents' },
            { value: '6-10', label: '6-10 documents' },
            { value: '11-20', label: '11-20 documents' },
            { value: '20+', label: '20+ documents' }
          ];

          const createdByOptions = [
            { value: '', label: 'Anyone' },
            { value: 'Dr. Smith', label: 'Dr. Smith' },
            { value: 'Dr. Johnson', label: 'Dr. Johnson' },
            { value: 'Dr. Brown', label: 'Dr. Brown' },
            { value: 'Nurse Wilson', label: 'Nurse Wilson' },
            { value: 'Therapist Adams', label: 'Therapist Adams' }
          ];

          return (
            <div className="p-4 bg-muted/30 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Created Date
                  </label>
                  <Select
                    value={filters?.dateRange}
                    onValueChange={(value) => handleFilterChange('dateRange', value)}
                    options={dateRangeOptions}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Specialty
                  </label>
                  <Select
                    value={filters?.specialty}
                    onValueChange={(value) => handleFilterChange('specialty', value)}
                    options={specialtyOptions}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Document Count
                  </label>
                  <Select
                    value={filters?.documentCount}
                    onValueChange={(value) => handleFilterChange('documentCount', value)}
                    options={documentCountOptions}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Created By
                  </label>
                  <Select
                    value={filters?.createdBy}
                    onValueChange={(value) => handleFilterChange('createdBy', value)}
                    options={createdByOptions}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Last Activity
                  </label>
                  <Select
                    value={filters?.lastActivityRange}
                    onValueChange={(value) => handleFilterChange('lastActivityRange', value)}
                    options={dateRangeOptions}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Use advanced filters to narrow down patient search results
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    <Icon name="RotateCcw" size={16} className="mr-2" />
                    Reset Filters
                  </Button>
                </div>
              </div>
            </div>
          );
        };

        export default AdvancedFilters;