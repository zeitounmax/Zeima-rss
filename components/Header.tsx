'use client';

interface HeaderProps {
    onRefresh: () => void;
    loading: boolean;
}

export default function Header({ onRefresh, loading }: HeaderProps) {
    return (
        <header className="card border-b">
            <div className="max-w-3xl mx-auto px-4 py-6 flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Rss-Zeima</h1>
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="px-4 py-2 text-primary border border-primary rounded hover:bg-primary hover:text-card disabled:opacity-50 transition-colors"
                >
                    Actualiser
                </button>
            </div>
        </header>
    );
}