import React from 'react';
import Icon from '../AppIcon';

const Breadcrumb = ({ items = [] }) => {
  if (!items || items?.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items?.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <Icon name="ChevronRight" size={16} className="mx-2 text-border" />
            )}
            {item?.href && index < items?.length - 1 ? (
              <a
                href={item?.href}
                className="hover:text-foreground transition-clinical font-medium"
              >
                {item?.label}
              </a>
            ) : (
              <span className={index === items?.length - 1 ? 'text-foreground font-medium' : ''}>
                {item?.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;