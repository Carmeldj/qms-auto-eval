import React, { useState, useEffect } from 'react';
import { stampGenerator } from '../services/StampGenerator';
import { Download, RefreshCw } from 'lucide-react';

interface StampPreviewProps {
  pharmacyName: string;
  size?: number;
}

const StampPreview: React.FC<StampPreviewProps> = ({ pharmacyName, size = 200 }) => {
  const [stampImage, setStampImage] = useState<string>('');

  useEffect(() => {
    if (pharmacyName.trim()) {
      const image = stampGenerator.generateStamp(pharmacyName, size);
      setStampImage(image);
    }
  }, [pharmacyName, size]);

  const handleDownload = () => {
    if (!stampImage) return;

    const link = document.createElement('a');
    link.href = stampImage;
    link.download = `cachet-${pharmacyName.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRegenerate = () => {
    if (pharmacyName.trim()) {
      const image = stampGenerator.generateStamp(pharmacyName, size);
      setStampImage(image);
    }
  };

  if (!pharmacyName.trim()) {
    return (
      <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-sm text-gray-500">Veuillez renseigner le nom de la pharmacie pour générer le cachet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {stampImage && (
        <>
          <div className="flex justify-center items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
            <img src={stampImage} alt="Cachet" className="max-w-full" style={{ width: size }} />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRegenerate}
              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Régénérer</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-white rounded-lg hover:opacity-90 transition-colors text-sm"
              style={{ backgroundColor: '#009688' }}
            >
              <Download className="h-4 w-4" />
              <span>Télécharger</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StampPreview;
