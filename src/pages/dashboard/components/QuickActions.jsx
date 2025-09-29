import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickActions = () => {
  const navigate = useNavigate();

  const handleNewDocument = () => {
    navigate('/document-editor');
  };

  const handleUploadFiles = () => {
    // Create a hidden file input and trigger it
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.mp3,.wav,.mp4';
    input.onchange = (event) => {
      const files = Array.from(event?.target?.files);
      console.log('Files selected for upload:', files);
      // Here you would typically upload files to your backend/storage
      alert(`Selected ${files?.length} file(s) for upload`);
    };
    input?.click();
  };

  const handleVoiceRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices?.getUserMedia({ audio: true })?.then(() => {
          alert('Voice recording feature would start here. Redirecting to document editor with voice capabilities.');
          navigate('/document-editor?voice=true');
        })?.catch(() => {
          alert('Microphone access denied. Please enable microphone permissions to use voice recording.');
        });
    } else {
      alert('Voice recording not supported in this browser.');
    }
  };

  const handleViewTemplates = () => {
    navigate('/template-builder');
  };

  const actions = [
    {
      id: 1,
      title: 'New Document',
      description: 'Create with AI assistance',
      icon: 'FileText',
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'from-blue-600 to-blue-700',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      onClick: handleNewDocument
    },
    {
      id: 2,
      title: 'Upload Files',
      description: 'PDF, audio, images',
      icon: 'Upload',
      gradient: 'from-emerald-500 to-emerald-600',
      hoverGradient: 'from-emerald-600 to-emerald-700',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      onClick: handleUploadFiles
    },
    {
      id: 3,
      title: 'Document Editor',
      description: 'Edit and format documents',
      icon: 'Edit',
      gradient: 'from-purple-500 to-purple-600',
      hoverGradient: 'from-purple-600 to-purple-700',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      onClick: handleNewDocument
    },
    {
      id: 4,
      title: 'Template Builder',
      description: 'Create custom templates',
      icon: 'Layout',
      gradient: 'from-amber-500 to-amber-600',
      hoverGradient: 'from-amber-600 to-amber-700',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      onClick: handleViewTemplates
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Quick Actions</h3>
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions?.map((action, index) => (
          <div
            key={action?.id}
            className={`group relative overflow-hidden bg-gradient-to-br ${action?.gradient} hover:${action?.hoverGradient} 
                       rounded-xl p-5 cursor-pointer transform transition-all duration-300 ease-out
                       hover:scale-105 hover:shadow-xl hover:-translate-y-1
                       before:absolute before:inset-0 before:bg-white before:opacity-0 
                       hover:before:opacity-10 before:transition-opacity before:duration-300
                       animation-delay-${index * 100}`}
            onClick={action?.onClick}
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }}
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-16 h-16 opacity-20">
              <div className="absolute inset-0 bg-white rounded-full transform translate-x-6 -translate-y-6"></div>
              <div className="absolute inset-0 bg-white rounded-full transform translate-x-8 -translate-y-4 scale-75"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className={`${action?.iconBg} ${action?.iconColor} p-2.5 rounded-lg 
                               transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                  <Icon name={action?.icon} size={20} />
                </div>
                <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center
                               transform transition-all duration-300 group-hover:rotate-45">
                  <Icon name="ArrowUpRight" size={12} className="text-white" />
                </div>
              </div>
              
              <div className="text-white">
                <h4 className="font-semibold text-base mb-1 group-hover:text-shadow-sm transition-all duration-300">
                  {action?.title}
                </h4>
                <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                  {action?.description}
                </p>
              </div>
            </div>

            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0
                           group-hover:opacity-20 transform -skew-x-12 -translate-x-full 
                           group-hover:translate-x-full transition-all duration-700 ease-out"></div>
          </div>
        ))}
      </div>
      
      {/* Bottom Accent Line */}
      <div className="mt-6 h-1 bg-gradient-to-r from-blue-500 via-emerald-500 via-purple-500 to-amber-500 rounded-full opacity-60"></div>
    </div>
  );
};

export default QuickActions;