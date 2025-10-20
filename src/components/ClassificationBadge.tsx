import React from 'react';
import { FileText } from 'lucide-react';
import { generateDocumentCode, getCategoryByCode, getProcessForCategory } from '../data/documentClassification';

interface ClassificationBadgeProps {
  classificationCode?: string;
  pharmacyInitials?: string;
  showFullCode?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const ClassificationBadge: React.FC<ClassificationBadgeProps> = ({
  classificationCode,
  pharmacyInitials = '',
  showFullCode = true,
  size = 'medium'
}) => {
  if (!classificationCode) {
    return null;
  }

  const category = getCategoryByCode(classificationCode);
  const process = getProcessForCategory(classificationCode);

  const fullCode = pharmacyInitials
    ? generateDocumentCode(pharmacyInitials, process?.code || '', classificationCode)
    : `[XXX]/${process?.code || ''}/${classificationCode}`;

  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-3 py-1.5',
    large: 'text-base px-4 py-2'
  };

  return (
    <div className="space-y-2">
      {showFullCode && (
        <div
          className={`inline-flex items-center space-x-2 rounded-lg font-mono font-semibold ${sizeClasses[size]}`}
          style={{ backgroundColor: '#e0f2f1', color: '#009688' }}
        >
          <FileText className="h-4 w-4" />
          <span>{fullCode}</span>
        </div>
      )}

      {category && (
        <div className="text-xs text-gray-600">
          <div className="font-medium">
            {process && `${process.name} > `}
            {category.name}
          </div>
          {category.description && (
            <div className="text-gray-500 mt-1">{category.description}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassificationBadge;
