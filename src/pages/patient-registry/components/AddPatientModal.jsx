import React, { useState, useEffect } from 'react';
        import Button from '../../../components/ui/Button';
        import Input from '../../../components/ui/Input';
        import Select from '../../../components/ui/Select';
        import Icon from '../../../components/AppIcon';

        const AddPatientModal = ({ isOpen, onClose, patient, onSave, isEditing = false }) => {
          const [formData, setFormData] = useState({
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            gender: '',
            phone: '',
            email: '',
            emergencyContact: '',
            assignedSpecialty: '',
            careTeam: [],
            insurance: '',
            notes: '',
            mrn: '',
            status: 'active'
          });

          const [errors, setErrors] = useState({});
          const [isLoading, setIsLoading] = useState(false);

          useEffect(() => {
            if (patient && isEditing) {
              setFormData({
                ...patient,
                careTeam: patient?.careTeam || []
              });
            } else {
              setFormData({
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                gender: '',
                phone: '',
                email: '',
                emergencyContact: '',
                assignedSpecialty: '',
                careTeam: [],
                insurance: '',
                notes: '',
                mrn: '',
                status: 'active'
              });
            }
            setErrors({});
          }, [patient, isEditing, isOpen]);

          if (!isOpen) return null;

          const genderOptions = [
            { value: '', label: 'Select Gender' },
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Other', label: 'Other' },
            { value: 'Prefer not to say', label: 'Prefer not to say' }
          ];

          const specialtyOptions = [
            { value: '', label: 'Select Specialty' },
            { value: 'Physical Therapy', label: 'Physical Therapy' },
            { value: 'Occupational Therapy', label: 'Occupational Therapy' },
            { value: 'Speech Therapy', label: 'Speech Therapy' },
            { value: 'General Medicine', label: 'General Medicine' },
            { value: 'Cardiology', label: 'Cardiology' },
            { value: 'Orthopedics', label: 'Orthopedics' }
          ];

          const statusOptions = [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' }
          ];

          const validateForm = () => {
            const newErrors = {};

            if (!formData?.firstName?.trim()) newErrors.firstName = 'First name is required';
            if (!formData?.lastName?.trim()) newErrors.lastName = 'Last name is required';
            if (!formData?.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
            if (!formData?.gender) newErrors.gender = 'Gender is required';
            if (!formData?.phone?.trim()) newErrors.phone = 'Phone number is required';
            if (!formData?.email?.trim()) newErrors.email = 'Email is required';
            if (!formData?.emergencyContact?.trim()) newErrors.emergencyContact = 'Emergency contact is required';
            if (!formData?.assignedSpecialty) newErrors.assignedSpecialty = 'Assigned specialty is required';
            if (!formData?.mrn?.trim()) newErrors.mrn = 'MRN is required';

            // Email validation
            if (formData?.email && !/\S+@\S+\.\S+/?.test(formData?.email)) {
              newErrors.email = 'Please enter a valid email address';
            }

            // Date validation (not future date)
            if (formData?.dateOfBirth && new Date(formData?.dateOfBirth) > new Date()) {
              newErrors.dateOfBirth = 'Date of birth cannot be in the future';
            }

            setErrors(newErrors);
            return Object.keys(newErrors)?.length === 0;
          };

          const handleSubmit = async (e) => {
            e?.preventDefault();
            
            if (!validateForm()) return;

            setIsLoading(true);
            try {
              await onSave?.(formData);
              onClose?.();
            } catch (error) {
              console.error('Failed to save patient:', error);
            } finally {
              setIsLoading(false);
            }
          };

          const handleInputChange = (field, value) => {
            setFormData(prev => ({ ...prev, [field]: value }));
            if (errors?.[field]) {
              setErrors(prev => ({ ...prev, [field]: '' }));
            }
          };

          return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-card rounded-lg shadow-clinical max-w-2xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground">
                    {isEditing ? 'Edit Patient' : 'Add New Patient'}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <Icon name="X" size={16} />
                  </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h4 className="font-medium text-foreground mb-4">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          First Name *
                        </label>
                        <Input
                          value={formData?.firstName}
                          onChange={(e) => handleInputChange('firstName', e?.target?.value)}
                          placeholder="Enter first name"
                          error={errors?.firstName}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Last Name *
                        </label>
                        <Input
                          value={formData?.lastName}
                          onChange={(e) => handleInputChange('lastName', e?.target?.value)}
                          placeholder="Enter last name"
                          error={errors?.lastName}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Date of Birth *
                        </label>
                        <Input
                          type="date"
                          value={formData?.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e?.target?.value)}
                          error={errors?.dateOfBirth}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Gender *
                        </label>
                        <Select
                          value={formData?.gender}
                          onValueChange={(value) => handleInputChange('gender', value)}
                          options={genderOptions}
                          error={errors?.gender}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          MRN *
                        </label>
                        <Input
                          value={formData?.mrn}
                          onChange={(e) => handleInputChange('mrn', e?.target?.value)}
                          placeholder="Enter medical record number"
                          error={errors?.mrn}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Status
                        </label>
                        <Select
                          value={formData?.status}
                          onValueChange={(value) => handleInputChange('status', value)}
                          options={statusOptions}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="font-medium text-foreground mb-4">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Phone Number *
                        </label>
                        <Input
                          value={formData?.phone}
                          onChange={(e) => handleInputChange('phone', e?.target?.value)}
                          placeholder="(555) 123-4567"
                          error={errors?.phone}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          value={formData?.email}
                          onChange={(e) => handleInputChange('email', e?.target?.value)}
                          placeholder="patient@email.com"
                          error={errors?.email}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Emergency Contact *
                        </label>
                        <Input
                          value={formData?.emergencyContact}
                          onChange={(e) => handleInputChange('emergencyContact', e?.target?.value)}
                          placeholder="Name - Phone Number"
                          error={errors?.emergencyContact}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Care Information */}
                  <div>
                    <h4 className="font-medium text-foreground mb-4">Care Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Assigned Specialty *
                        </label>
                        <Select
                          value={formData?.assignedSpecialty}
                          onValueChange={(value) => handleInputChange('assignedSpecialty', value)}
                          options={specialtyOptions}
                          error={errors?.assignedSpecialty}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Insurance Provider
                        </label>
                        <Input
                          value={formData?.insurance}
                          onChange={(e) => handleInputChange('insurance', e?.target?.value)}
                          placeholder="Enter insurance provider"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Notes
                        </label>
                        <textarea
                          value={formData?.notes}
                          onChange={(e) => handleInputChange('notes', e?.target?.value)}
                          placeholder="Enter any additional notes about the patient..."
                          rows={3}
                          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex items-center"
                  >
                    {isLoading && <Icon name="Loader2" size={16} className="mr-2 animate-spin" />}
                    {isEditing ? 'Update Patient' : 'Add Patient'}
                  </Button>
                </div>
              </div>
            </div>
          );
        };

        export default AddPatientModal;