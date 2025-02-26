import { useState } from 'react';
import { FeedSource } from '@/types/feed';
import { predefinedSources, categories, PredefinedSource } from '@/lib/predefinedSources';

interface SourceSelectorProps {
  onSourcesSelected: (sources: FeedSource[]) => void;
  onClose: () => void;
}

export default function SourceSelector({ onSourcesSelected, onClose }: SourceSelectorProps) {
  const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]);

  const handleSourceToggle = (source: PredefinedSource) => {
    const newSelected = new Set(selectedSources);
    if (newSelected.has(source.id)) {
      newSelected.delete(source.id);
    } else {
      newSelected.add(source.id);
    }
    setSelectedSources(newSelected);
  };

  const handleSubmit = () => {
    const sources: FeedSource[] = predefinedSources
      .filter(source => selectedSources.has(source.id))
      .map(source => ({
        id: source.id,
        name: source.name,
        url: source.url,
        category: source.category
      }));
    onSourcesSelected(sources);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="card p-6 rounded-lg shadow-sm w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Sources RSS recommandées</h2>
        
        <div className="flex gap-4 flex-1 overflow-hidden">
          <div className="w-48 space-y-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeCategory === category 
                    ? 'bg-primary text-card' 
                    : 'hover:bg-card'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {predefinedSources
                .filter(source => source.category === activeCategory)
                .map(source => (
                  <div
                    key={source.id}
                    className="flex items-start space-x-4 p-4 rounded-lg border hover:border-primary transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSources.has(source.id)}
                      onChange={() => handleSourceToggle(source)}
                      className="mt-1"
                    />
                    <div>
                      <h3 className="font-medium">
                        {source.name}
                        <span className="ml-2 text-xs px-2 py-1 rounded-full bg-card">
                          {source.language}
                        </span>
                      </h3>
                      <p className="text-sm opacity-75">{source.description}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-card transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-card transition-colors"
          >
            Ajouter ({selectedSources.size} sélectionnées)
          </button>
        </div>
      </div>
    </div>
  );
} 