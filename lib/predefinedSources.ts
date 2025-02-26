export interface PredefinedSource {
    id: string;
    name: string;
    url: string;
    category: string;
    description: string;
    language: string;
}

export const predefinedSources: PredefinedSource[] = [
    // Actualités
    {
        id: 'franceinfo',
        name: 'France Info',
        url: 'https://www.francetvinfo.fr/titres.rss',
        category: 'Actualités',
        description: 'Information en continu',
        language: 'fr'
    },
    {
        id: '20minutes',
        name: '20 Minutes',
        url: 'https://www.20minutes.fr/feeds/rss-une.xml',
        category: 'Actualités',
        description: 'Actualités en temps réel',
        language: 'fr'
    },
    {
        id: 'Liberation',
        name: 'Liberation',
        url: 'https://www.liberation.fr/rss/une.xml',
        category: 'Actualités',
        description: 'Actualités en temps réel',
        language: 'fr'
    },
    {
        id: 'BFM',
        name: 'BFM',
        url: 'https://www.bfmtv.com/rss/news-24-7/',
        category: 'Actualités',
        description: 'Actualités en temps réel',
        language: 'fr'
    },
    {
        id: 'RTBF',
        name: 'RTBF',
        url: 'http://rss.rtbf.be/article/rss/highlight_rtbf_info.xml?source=internal',
        category: 'Actualités',
        description: 'Actualités en temps réel',
        language: 'fr'
    },
    {
        id: 'letemps',
        name: 'Le Temps',
        url: 'https://www.letemps.ch/articles.rss',
        category: 'Actualités',
        description: 'Actualités en temps réel provenant de la Suisse',
        language: 'fr'
    },
    // Tech
    {
        id: 'korben',
        name: 'Korben',
        url: 'https://korben.info/feed',
        category: 'Tech',
        description: 'Blog tech et astuces',
        language: 'fr'
    },
    {
        id: 'lemondeinformatique',
        name: 'Le Monde Informatique',
        url: 'https://www.lemondeinformatique.fr/flux-rss/thematique/toutes-les-actualites/rss.xml',
        category: 'Tech',
        description: 'Actualités Tech',
        language: 'fr'
    },
    {
        id: 'RTBF Tech',
        name: 'RTBF Tech',
        url: 'http://rss.rtbf.be/article/rss/highlight_rtbf_sciences-et-technologies.xml?source=internal',
        category: 'Tech',
        description: 'Actualités Tech',
        language: 'fr'
    },
    {
        id: 'ixpe',
        name: 'Ixpe',
        url: 'https://rss.rtbf.be/article/rss/highlight_rtbfculture_culture-popup-jeuxvideo.xml?source=internal',
        category: 'Tech',
        description: 'Actualités Tech',
        language: 'fr'
    },
    {
        id: 'nextink',
        name: 'Next Ink (Next Inpact)',
        url: 'https://next.ink/feed/free',
        category: 'Tech',
        description: 'Actualités Tech,Geopolitique,OSINT,Cybersécurité,IA,etc.',
        language: 'fr'
    },
    // Dev
    {
        id: 'devto',
        name: 'Dev.to',
        url: 'https://dev.to/feed/',
        category: 'Dev',
        description: 'Communauté de développeurs',
        language: 'en'
    },
    {
        id: 'hashnode',
        name: 'Hashnode',
        url: 'https://hashnode.com/feed',
        category: 'Dev',
        description: 'Blog de développeurs',
        language: 'en'
    },
    {
        id: 'lemondeinformatiqueLogiciels',
        name: 'Le Monde Informatique Logiciels',
        url: 'https://www.lemondeinformatique.fr/flux-rss/thematique/logiciel/rss.xml',
        category: 'Dev',
        description: 'Actualités Logiciels',
        language: 'fr'
    },
    // Gaming
    {
        id: 'segamag',
        name: 'Segamag',
        url: 'https://sega-mag.com/rss.xml',
        category: 'Gaming',
        description: 'Actualités jeux vidéo de SEGA',
        language: 'fr'
    },
    
    // Science
    {
        id: 'futurasciences',
        name: 'Futura Sciences',
        url: 'https://www.futura-sciences.com/rss/actualites.xml',
        category: 'Science',
        description: 'Actualités scientifiques',
        language: 'fr'
    },
    {
        id: 'RTBF Science',
        name: 'RTBF Science',
        url: 'http://rss.rtbf.be/article/rss/highlight_rtbftendance_espace.xml?source=internal',
        category: 'Science',
        description: 'Actualités scientifiques',
        language: 'fr'
    },
    {
        id: 'RTBF Science Decouverte',
        name: 'RTBF Science Decouverte',
        url: 'http://rss.rtbf.be/article/rss/highlight_rtbf_decouvertes-scientifiques.xml?source=internal',
        category: 'Science',
        description: 'Actualités decouverte scientifique',
        language: 'fr'
    },
    // Open Source
    {
        id: 'linuxfr',
        name: 'LinuxFr',
        url: 'https://linuxfr.org/news.atom',
        category: 'Open Source',
        description: 'Actualités Linux et Open Source',
        language: 'fr'
    },
    // Cybersécurité
    {
        id: 'zataz',
        name: 'ZATAZ',
        url: 'https://www.zataz.com/feed/',
        category: 'Cybersécurité',
        description: 'Actualités cybersécurité',
        language: 'fr'
    },
    // Anime
    {
        id: 'anime-news-network',
        name: 'Anime News Network',
        url: 'https://www.animenewsnetwork.com/all/rss.xml?ann-edition=fr',
        category: 'Anime',
        description: 'Actualités Anime',
        language: 'fr'
    },
    {
        id: 'animeland',
        name: 'AnimeLand',
        url: 'https://www.animeland.fr/rss',
        category: 'Anime',
        description: 'Actualités Anime et Manga ',
        language: 'fr'
    }
];

export const categories = Array.from(new Set(predefinedSources.map(s => s.category))).sort(); 