'use client';
import { useEffect, useState } from 'react';
import { FeedItem as FeedItemType, FeedSource } from '@/types/feed';
import { fetchFeed } from '@/lib/rss';
import Header from '../components/Header';
import FeedItemComponent from '../components/FeedItem';
import AddButton from '../components/AddButton';

export default function Home() {
  const [items, setItems] = useState<FeedItemType[]>([]);
  const [sources, setSources] = useState<FeedSource[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedSources = localStorage.getItem('rssSources');
    if (savedSources) {
      setSources(JSON.parse(savedSources));
    }
  }, []);

  const refreshFeeds = async () => {
    setLoading(true);
    try {
      const allFeeds = await Promise.all(
        sources.map(async (source) => {
          const feed = await fetchFeed(source.url);
          return feed.items.map(item => ({
            ...item,
            source: source.name
          }));
        })
      );
      
      const flattenedItems = allFeeds
        .flat()
        .sort((a, b) => {
          const dateA = new Date(a.pubDate);
          const dateB = new Date(b.pubDate);
          return dateB.getTime() - dateA.getTime();
        })
        .filter(item => !isNaN(new Date(item.pubDate).getTime()))
        .map(item => ({
          ...item,
          image: item.image || undefined
        }));

      setItems(flattenedItems);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des flux:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sources.length > 0) {
      refreshFeeds();
    } else {
      setItems([]);
    }
  }, [sources]);

  return (
    <div className="min-h-screen bg-background">
      <Header onRefresh={refreshFeeds} loading={loading} />
      
      <main className="max-w-3xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-8 opacity-75">
            <p>Chargement des flux...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-6">
            {items.map((item, index) => (
              <FeedItemComponent key={`${item.link}-${index}`} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 opacity-75">
            <p>Aucun article à afficher</p>
          </div>
        )}
        
        <AddButton sources={sources} setSources={setSources} />
      </main>
    </div>
  );
}