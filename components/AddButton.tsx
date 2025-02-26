'use client';
import { FeedSource } from '@/types/feed';
import { useState } from 'react';
import SourceSelector from './SourceSelector';

interface AddButtonProps {
  sources: FeedSource[];
  setSources: (sources: FeedSource[]) => void;
}

export default function AddButton({ sources, setSources }: AddButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [showSourceSelector, setShowSourceSelector] = useState(false);

  const categories = Array.from(new Set(sources.map(s => s.category).filter(Boolean)));

  const handleExport = () => {
    const dataStr = JSON.stringify(sources, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rss-sources.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSources = JSON.parse(e.target?.result as string);
          setSources(importedSources);
          localStorage.setItem('rssSources', JSON.stringify(importedSources));
          setIsMenuOpen(false);
        } catch (error) {
          console.error('Erreur lors de l\'import:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url || !name) return;

    if (isEditing) {
      const updatedSources = sources.map(source => 
        source.id === isEditing 
          ? { ...source, name, url, category }
          : source
      );
      setSources(updatedSources);
    } else {
      const newSource: FeedSource = {
        id: Date.now().toString(),
        url,
        name,
        category
      };
      setSources([...sources, newSource]);
    }
    
    localStorage.setItem('rssSources', JSON.stringify(sources));
    resetForm();
  };

  const handleEdit = (source: FeedSource) => {
    setIsEditing(source.id);
    setName(source.name);
    setUrl(source.url);
    setCategory(source.category);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedSources = sources.filter(source => source.id !== id);
    setSources(updatedSources);
    localStorage.setItem('rssSources', JSON.stringify(updatedSources));
  };

  const resetForm = () => {
    setUrl('');
    setName('');
    setCategory('');
    setIsEditing(null);
    setIsOpen(false);
  };

  const handlePredefinedSourcesSelected = (newSources: FeedSource[]) => {
    const updatedSources = [...sources];
    newSources.forEach(newSource => {
      if (!sources.some(s => s.id === newSource.id)) {
        updatedSources.push(newSource);
      }
    });
    setSources(updatedSources);
    localStorage.setItem('rssSources', JSON.stringify(updatedSources));
  };

  return (
    <>
      {showSourceSelector && (
        <SourceSelector
          onSourcesSelected={handlePredefinedSourcesSelected}
          onClose={() => setShowSourceSelector(false)}
        />
      )}

      <div className="fixed bottom-8 right-8 flex flex-col items-end space-y-4">
        {isOpen && (
          <div className="card p-6 rounded-lg shadow-sm w-96 mb-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nom de la source
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-card focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  URL du flux RSS
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-card focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Catégorie
                </label>
                <input
                  type="text"
                  list="categories"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-card focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <datalist id="categories">
                  {categories.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm border rounded-lg hover:bg-card transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-card transition-colors"
                >
                  {isEditing ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {isMenuOpen && (
          <div className="card p-4 rounded-lg shadow-sm mb-4 w-64">
            <div className="space-y-4">
              <h3 className="font-medium mb-2">Sources RSS ({sources.length})</h3>
              <button
                onClick={() => {
                  setShowSourceSelector(true);
                  setIsMenuOpen(false);
                }}
                className="w-full px-3 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-card transition-colors"
              >
                Parcourir les sources recommandées
              </button>
              <div className="flex justify-between gap-2">
                <button
                  onClick={handleExport}
                  className="flex-1 px-3 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-card transition-colors"
                >
                  Exporter
                </button>
                <label className="flex-1">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                  <span className="block px-3 py-2 text-sm text-center text-primary border border-primary rounded-lg hover:bg-primary hover:text-card transition-colors cursor-pointer">
                    Importer
                  </span>
                </label>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {sources.map(source => (
                  <div key={source.id} className="py-2 border-b last:border-0">
                    <div className="flex justify-between items-center">
                      <span className="text-sm truncate flex-1" title={source.name}>
                        {source.name}
                      </span>
                      <div className="flex gap-2 ml-2">
                        <button
                          onClick={() => {
                            setIsEditing(source.id);
                            setName(source.name);
                            setUrl(source.url);
                            setCategory(source.category || '');
                            setIsOpen(true);
                            setIsMenuOpen(false);
                          }}
                          className="text-primary hover:opacity-75 transition-opacity text-sm"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(source.id)}
                          className="text-red-500 hover:opacity-75 transition-opacity text-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                    {source.category && (
                      <span className="text-xs opacity-75">{source.category}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsOpen(false);
            }}
            className="p-2 text-primary border border-primary rounded-full shadow-sm hover:bg-primary hover:text-card transition-colors"
            title="Gérer les sources"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <button
            onClick={() => {
              setIsOpen(!isOpen);
              setIsMenuOpen(false);
              setIsEditing(null);
              setUrl('');
              setName('');
              setCategory('');
            }}
            className="p-2 text-primary border border-primary rounded-full shadow-sm hover:bg-primary hover:text-card transition-colors"
            title="Ajouter une source"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}