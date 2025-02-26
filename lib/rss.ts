import { decode } from 'html-entities';

interface FeedItem {
    title: string;
    link: string;
    content: string;
    pubDate: string;
    source: string;
    read: boolean;
    image: string | null;
}

interface Feed {
    feedInfo: {
        title: string;
        image: string | null;
    };
    items: FeedItem[];
}

const cleanText = (text: string): string => {
    if (!text) return '';
    try {
        text = text.replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1');
        return decode(text.trim())
            .replace(/\s+/g, ' ')
            .trim();
    } catch (e) {
        return text.trim();
    }
};

const extractContent = (text: string, tag: string): string => {
    const regex = new RegExp(`<${tag}[^>]*>(?:<!\[CDATA\[(.*?)\]\]>|([^<]*))<\/${tag}>`, 'is');
    const match = text.match(regex);
    return match ? cleanText(match[1] || match[2] || '') : '';
};

const extractImage = (item: string): string | null => {
    try {
        item = item.replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1');

        const mediaMatch = item.match(/<media:content[^>]+url="([^"]+)"/i);
        if (mediaMatch?.[1]) return mediaMatch[1];

        const enclosureMatch = item.match(/<enclosure[^>]+url="([^"]+)"/i);
        if (enclosureMatch?.[1]) return enclosureMatch[1];

        const imgMatch = item.match(/<img[^>]+src="([^"]+)"/i);
        if (imgMatch?.[1]) return imgMatch[1];

        return null;
    } catch (e) {
        return null;
    }
};

const parseDate = (dateStr: string): string => {
    try {
        const date = new Date(dateStr);
        return !isNaN(date.getTime()) ? date.toISOString() : new Date().toISOString();
    } catch {
        return new Date().toISOString();
    }
};

const parseRSS = (xml: string): Feed => {
    const items: FeedItem[] = [];
    
    xml = xml.replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1');
    
    const channelTitle = extractContent(xml, 'title') || 'Flux RSS';
    const channelImage = xml.match(/<image>[^>]*<url>([^<]+)<\/url>/i)?.[1] || null;

    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
        const itemXml = match[1];
        const title = extractContent(itemXml, 'title');
        const link = extractContent(itemXml, 'link');
        
        let content = extractContent(itemXml, 'description') || 
                     extractContent(itemXml, 'content:encoded') ||
                     extractContent(itemXml, 'content');
                     
        content = content.replace(/<img[^>]*>/g, ''); 
        content = content.replace(/<[^>]+>/g, ' '); 
        
        const pubDate = parseDate(extractContent(itemXml, 'pubDate') || extractContent(itemXml, 'dc:date'));
        const image = extractImage(itemXml);

        if (title || content) {
            items.push({
                title: title || 'Sans titre',
                link: link || '#',
                content: content || '',
                pubDate,
                source: channelTitle,
                read: false,
                image
            });
        }
    }

    return {
        feedInfo: {
            title: channelTitle,
            image: channelImage
        },
        items: items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    };
};

const proxyUrls = [
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url: string) => `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(url)}`,
    (url: string) => `https://cors.eu.org/${url}`
];

export const fetchFeed = async (url: string): Promise<Feed> => {
    let lastError = null;

    for (const proxyUrlGenerator of proxyUrls) {
        try {
            const proxyUrl = proxyUrlGenerator(url);
            
            const response = await fetch(proxyUrl, {
                headers: {
                    'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*'
                },
                signal: AbortSignal.timeout(10000)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const xml = await response.text();
            
            if (!xml) {
                throw new Error('Réponse vide du proxy');
            }

            const feed = parseRSS(xml);
            
            if (feed.items.length > 0) {
                return feed;
            }
            
            throw new Error('Aucun item trouvé dans le flux');

        } catch (error) {
            console.warn(`Échec avec le proxy ${proxyUrlGenerator(url)}:`, error);
            lastError = error;
            continue;
        }
    }

    console.error(`Tous les proxies ont échoué pour ${url}:`, lastError);
    return {
        feedInfo: {
            title: new URL(url).hostname,
            image: null,
        },
        items: []
    };
};


