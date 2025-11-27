import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Download, ChevronDown, ChevronUp, Eye, EyeOff, X } from 'lucide-react';
import { RegisterListData, RegisterListType, RegisterCategory, RegisterItem } from '../types/registerList';
import { registerListEditorService } from '../services/RegisterListEditorService';
import { useAuth } from '../contexts/AuthContext';

interface RegisterListEditorProps {
  listType: RegisterListType;
  pharmacyName: string;
  onClose: () => void;
}

const RegisterListEditor: React.FC<RegisterListEditorProps> = ({ listType, pharmacyName, onClose }) => {
  const { user } = useAuth();
  const [listData, setListData] = useState<RegisterListData>({ categories: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadList();
  }, [listType]);

  const loadList = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const data = await registerListEditorService.getOrCreateDefaultList(user.email, listType);
      setListData(data);
      setExpandedCategories(new Set(data.categories.map(cat => cat.id)));
    } catch (error) {
      console.error('Error loading list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.email) return;
    setSaving(true);
    try {
      await registerListEditorService.saveCustomList(user.email, listType, listData);
      alert('Liste sauvegardée avec succès');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!user?.email) return;
    if (!confirm('Réinitialiser aux valeurs par défaut ? Toutes vos modifications seront perdues.')) return;
    setLoading(true);
    try {
      const data = await registerListEditorService.resetToDefault(user.email, listType);
      setListData(data);
      alert('Liste réinitialisée');
    } catch (error) {
      console.error('Error resetting:', error);
      alert('Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pharmacyName.trim()) {
      alert('Veuillez saisir le nom de la pharmacie');
      return;
    }
    registerListEditorService.generateCustomPDF(pharmacyName, listType, listData);
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleCategoryEnabled = (categoryId: string) => {
    setListData(prev => ({
      categories: prev.categories.map(cat =>
        cat.id === categoryId ? { ...cat, enabled: !cat.enabled } : cat
      )
    }));
  };

  const toggleItemEnabled = (categoryId: string, itemId: string) => {
    setListData(prev => ({
      categories: prev.categories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map(item =>
                item.id === itemId ? { ...item, enabled: !item.enabled } : item
              )
            }
          : cat
      )
    }));
  };

  const updateItemTitle = (categoryId: string, itemId: string, title: string) => {
    setListData(prev => ({
      categories: prev.categories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map(item =>
                item.id === itemId ? { ...item, title } : item
              )
            }
          : cat
      )
    }));
  };

  const listTitles: Record<RegisterListType, string> = {
    management: 'Liste des Registres/Documents de Gestion',
    dispensation: 'Liste des Registres de Traçabilité & Vigilance',
    information: 'Liste des Documents d\'Informations Pharmaceutiques'
  };

  const enabledCount = listData.categories.reduce((acc, cat) => {
    if (!cat.enabled) return acc;
    return acc + cat.items.filter(item => item.enabled).length;
  }, 0);

  const totalCount = listData.categories.reduce((acc, cat) => acc + cat.items.length, 0);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b sticky top-0 bg-white z-10 rounded-t-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{listTitles[listType]}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Personnalisez votre liste en activant/désactivant les éléments
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              {enabledCount} / {totalCount} éléments actifs
            </span>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Réinitialiser</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              <Download className="h-4 w-4" />
              <span>Télécharger PDF</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {listData.categories.map((category) => (
              <div key={category.id} className="border rounded-lg overflow-hidden">
                {/* Category Header */}
                <div
                  className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategoryEnabled(category.id);
                      }}
                      className="flex-shrink-0"
                    >
                      {category.enabled ? (
                        <Eye className="h-5 w-5 text-green-600" />
                      ) : (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${category.enabled ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                        {category.category}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {category.items.filter(i => i.enabled).length} / {category.items.length} éléments actifs
                      </p>
                    </div>
                  </div>
                  {expandedCategories.has(category.id) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>

                {/* Category Items */}
                {expandedCategories.has(category.id) && (
                  <div className="p-4 space-y-3 bg-white">
                    {category.items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-start space-x-3 p-3 rounded-lg border ${
                          item.enabled ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <button
                          onClick={() => toggleItemEnabled(category.id, item.id)}
                          className="flex-shrink-0 mt-1"
                        >
                          {item.enabled ? (
                            <Eye className="h-4 w-4 text-green-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateItemTitle(category.id, item.id, e.target.value)}
                            className={`w-full font-medium text-sm border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none ${
                              item.enabled ? 'text-gray-900' : 'text-gray-400'
                            }`}
                          />
                          {item.code && (
                            <span className="text-xs text-gray-500 mt-1 block">Code: {item.code}</span>
                          )}
                          {item.description && (
                            <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                          )}
                          {item.location && (
                            <p className="text-xs text-gray-500 mt-1">📍 {item.location}</p>
                          )}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.obligation && (
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                item.obligation.includes('OBLIGATOIRE')
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}>
                                {item.obligation}
                              </span>
                            )}
                            {item.retention && (
                              <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                                {item.retention}
                              </span>
                            )}
                            {item.reference && (
                              <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                                {item.reference}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Les modifications sont sauvegardées dans votre compte et réutilisables
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterListEditor;
