export interface FeedSource {
    id: string;
    url: string;
    name: string;
    category: string;
    image?: string;
  }
  
  export interface FeedItem {
    title: string;
    link: string;
    content: string;
    pubDate: string;
    source: string;
    read: boolean;
    image?: string;
  }