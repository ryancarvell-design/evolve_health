import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VideoCallModal = ({ onClose }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const participants = [
    { name: 'Dr. Sarah Chen', initials: 'SC', isHost: true },
    { name: 'Mike Rodriguez', initials: 'MR', isHost: false },
    { name: 'Lisa Park', initials: 'LP', isHost: false },
    { name: 'James Wilson', initials: 'JW', isHost: false }
  ];

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    setIsVideoOff(!isVideoOff);
  };

  const handleEndCall = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="w-full max-w-6xl h-full max-h-[90vh] bg-gray-900 rounded-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="text-white text-lg font-semibold">Team Collaboration Call</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Recording</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-gray-700">
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Video Grid */}
        <div className="flex-1 p-4 grid grid-cols-2 gap-4">
          {/* Main Video */}
          <div className="col-span-2 lg:col-span-1 bg-gray-800 rounded-lg overflow-hidden relative">
            <div className="aspect-video flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-2xl font-semibold mx-auto mb-4">
                  SC
                </div>
                <p className="text-lg font-medium">Dr. Sarah Chen</p>
                <p className="text-sm text-gray-400">Host</p>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 flex items-center space-x-2">
              <div className="bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
                Dr. Sarah Chen
              </div>
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Icon name="Mic" size={12} className="text-white" />
              </div>
            </div>
          </div>

          {/* Participant Videos */}
          <div className="col-span-2 lg:col-span-1 grid grid-cols-1 gap-4">
            {participants?.slice(1)?.map((participant, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden relative aspect-video">
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-lg font-semibold mx-auto mb-2">
                      {participant?.initials}
                    </div>
                    <p className="text-sm font-medium">{participant?.name}</p>
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 flex items-center space-x-1">
                  <div className="bg-black bg-opacity-50 px-2 py-1 rounded text-white text-xs">
                    {participant?.name}
                  </div>
                  <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <Icon name="MicOff" size={8} className="text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 px-6 py-4 flex items-center justify-center space-x-4">
          <Button
            variant="ghost"
            size="lg"
            onClick={handleToggleMute}
            className={`w-12 h-12 rounded-full ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-500'} text-white`}
          >
            <Icon name={isMuted ? "MicOff" : "Mic"} size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={handleToggleVideo}
            className={`w-12 h-12 rounded-full ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-500'} text-white`}
          >
            <Icon name={isVideoOff ? "VideoOff" : "Video"} size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-500 text-white"
          >
            <Icon name="Monitor" size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-500 text-white"
          >
            <Icon name="MessageSquare" size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-500 text-white"
          >
            <Icon name="Users" size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={handleEndCall}
            className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white ml-8"
          >
            <Icon name="PhoneOff" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;