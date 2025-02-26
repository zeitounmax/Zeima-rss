import type { FeedItem } from '@/types/feed';    

export default function FeedItem({ item }: { item: FeedItem }) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date inconnue';
      }
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Date inconnue';
    }
  };

  return (
    <article className="card p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm opacity-75">{formatDate(item.pubDate)}</span>
        <span className="text-sm font-medium text-primary">{item.source}</span>
      </div>
      <div className="flex gap-4">
        {item.image && (
          <div className="flex-shrink-0">
            <img 
              src={item.image} 
              alt=""
              className="w-24 h-24 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="flex-grow">
          <h2 className="text-xl font-semibold mb-2">
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              {item.title}
            </a>
          </h2>
          <p className="opacity-85 line-clamp-3">{item.content}</p>
        </div>
      </div>
    </article>
  );
}