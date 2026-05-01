import React from "react";
import { Link } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { API_URL } from "./config";

interface PostProps {
    _id: string;
    title: string;
    summary: string;
    cover: string;
    createdAt: string;
    author: {
        username: string;
    };
    category?: string;
}

export default function Post({ _id, title, summary, cover, createdAt, author, category }: PostProps) {
    // Build image URL only when a real path exists
    const getImageUrl = (path: string) => {
        if (!path) return null;
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        const cleanPath = path.replace(/^\/+/, '');
        return `${API_URL}/uploads/${cleanPath}`;
    };

    const imageUrl = getImageUrl(cover);

    return (
        <div className="group flex flex-col p-7 sm:px-6 border-b border-border-custom transition-colors duration-200 hover:bg-paper-warm sm:border-r sm:last:border-r-0">
            {imageUrl && (
                <div className="rounded-lg overflow-hidden mb-4 aspect-video bg-paper-warm shrink-0">
                    <Link to={`/post/${_id}`}>
                        <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.parentElement!.style.display = 'none';
                            }}
                        />
                    </Link>
                </div>
            )}
            <div className="flex-1 pt-1">
                <span className="inline-block font-sans text-[10px] font-bold uppercase tracking-widest text-accent-teal mb-2">
                    {category || 'Other'}
                </span>
                <Link to={`/post/${_id}`} className="no-underline text-ink">
                    <h2 className="font-serif text-xl font-bold leading-tight mb-2 hover:text-accent transition-colors">
                        {title}
                    </h2>
                </Link>
                <p className="flex items-center gap-2 text-xs text-ink-faint mb-2">
                    <span className="font-medium text-ink-light">created by @ {author.username}</span>
                    <time>{formatISO9075(new Date(createdAt))}</time>
                </p>
                <p className="font-sans text-[14px] text-ink-light leading-relaxed line-clamp-3">
                    {summary}
                </p>
            </div>
        </div>
    );
}
