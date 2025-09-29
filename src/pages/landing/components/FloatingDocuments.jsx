import React, { useEffect, useRef } from 'react';

const FloatingDocuments = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef?.current) return;

    const container = containerRef?.current;
    const documents = [];

    // Healthcare document types with different icons and colors
    const documentTypes = [
      { icon: '📋', name: 'Medical Chart', color: '#3B82F6' },
      { icon: '📊', name: 'Analytics Report', color: '#10B981' },
      { icon: '📝', name: 'Patient Notes', color: '#F59E0B' },
      { icon: '🩺', name: 'Assessment Form', color: '#EF4444' },
      { icon: '📄', name: 'Treatment Plan', color: '#8B5CF6' },
      { icon: '📈', name: 'Progress Report', color: '#06B6D4' },
      { icon: '🏥', name: 'Medical Record', color: '#EC4899' },
      { icon: '💊', name: 'Prescription', color: '#84CC16' }
    ];

    // Create floating document elements
    const createDocument = () => {
      const docType = documentTypes?.[Math.floor(Math.random() * documentTypes?.length)];
      const doc = document.createElement('div');
      
      doc.className = 'floating-document absolute pointer-events-none select-none transition-all duration-1000 ease-in-out';
      doc.innerHTML = `
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/20 transform hover:scale-105 transition-transform duration-300">
          <div class="flex items-center space-x-2">
            <span class="text-2xl">${docType?.icon}</span>
            <div class="flex flex-col">
              <div class="w-16 h-2 bg-white/30 rounded mb-1"></div>
              <div class="w-12 h-1.5 bg-white/20 rounded mb-1"></div>
              <div class="w-14 h-1.5 bg-white/20 rounded"></div>
            </div>
          </div>
        </div>
      `;

      // Random initial position (outside viewport)
      const startSide = Math.random();
      if (startSide < 0.25) {
        // From left
        doc.style.left = '-100px';
        doc.style.top = Math.random() * window.innerHeight + 'px';
      } else if (startSide < 0.5) {
        // From right
        doc.style.right = '-100px';
        doc.style.top = Math.random() * window.innerHeight + 'px';
      } else if (startSide < 0.75) {
        // From top
        doc.style.top = '-100px';
        doc.style.left = Math.random() * window.innerWidth + 'px';
      } else {
        // From bottom
        doc.style.bottom = '-100px';
        doc.style.left = Math.random() * window.innerWidth + 'px';
      }

      // Animation properties
      doc.dataset.speedX = (Math.random() - 0.5) * 0.5;
      doc.dataset.speedY = (Math.random() - 0.5) * 0.5;
      doc.dataset.rotation = Math.random() * 360;
      doc.dataset.rotationSpeed = (Math.random() - 0.5) * 2;
      doc.dataset.opacity = Math.random() * 0.5 + 0.3;

      doc.style.opacity = doc?.dataset?.opacity;
      doc.style.transform = `rotate(${doc?.dataset?.rotation}deg)`;

      container?.appendChild(doc);
      documents?.push(doc);

      // Remove document after it's off screen
      setTimeout(() => {
        if (doc?.parentNode) {
          doc?.parentNode?.removeChild(doc);
          const index = documents?.indexOf(doc);
          if (index > -1) {
            documents?.splice(index, 1);
          }
        }
      }, 15000);
    };

    // Animation loop
    const animateDocuments = () => {
      documents?.forEach(doc => {
        if (!doc?.parentNode) return;

        const rect = doc?.getBoundingClientRect();
        const speedX = parseFloat(doc?.dataset?.speedX);
        const speedY = parseFloat(doc?.dataset?.speedY);
        const rotationSpeed = parseFloat(doc?.dataset?.rotationSpeed);
        
        const currentLeft = parseFloat(doc?.style?.left) || rect?.left;
        const currentTop = parseFloat(doc?.style?.top) || rect?.top;
        const currentRotation = parseFloat(doc?.dataset?.rotation);

        // Update position
        doc.style.left = (currentLeft + speedX) + 'px';
        doc.style.top = (currentTop + speedY) + 'px';
        
        // Update rotation
        doc.dataset.rotation = (currentRotation + rotationSpeed) % 360;
        doc.style.transform = `rotate(${doc?.dataset?.rotation}deg)`;

        // Remove if completely off screen
        if (rect?.right < -200 || rect?.left > window.innerWidth + 200 || 
            rect?.bottom < -200 || rect?.top > window.innerHeight + 200) {
          if (doc?.parentNode) {
            doc?.parentNode?.removeChild(doc);
            const index = documents?.indexOf(doc);
            if (index > -1) {
              documents?.splice(index, 1);
            }
          }
        }
      });

      requestAnimationFrame(animateDocuments);
    };

    // Start creating documents
    const createDocumentInterval = setInterval(() => {
      if (documents?.length < 12) { // Limit number of documents
        createDocument();
      }
    }, 2000);

    // Start animation
    animateDocuments();

    // Initial documents
    for (let i = 0; i < 6; i++) {
      setTimeout(() => createDocument(), i * 500);
    }

    // Cleanup
    return () => {
      clearInterval(createDocumentInterval);
      documents?.forEach(doc => {
        if (doc?.parentNode) {
          doc?.parentNode?.removeChild(doc);
        }
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      style={{ zIndex: 1 }}
    />
  );
};

export default FloatingDocuments;