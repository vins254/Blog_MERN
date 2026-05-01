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
    // Robust image URL handling
    const getImageUrl = (path: string) => {
        if (!path) return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop';
        
        // Handle potential absolute URLs or base64
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        
        const cleanPath = path.replace(/^\/+/, "");
        // If it looks like a filename (no slashes), assume it's in /uploads/
        if (!cleanPath.includes('/')) {
            return `${API_URL}/uploads/${cleanPath}`;
        }
        return `${API_URL}/${cleanPath}`;
    };

    return (
        <div className="post">
            <div className="image">
                <Link to={`/post/${_id}`}>
                    <img 
                        src={getImageUrl(cover)} 
                        alt={title} 
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop';
                        }}
                    />
                </Link>
            </div>
            <div className="texts">
                <span className="category-badge">{category || 'Other'}</span>
                <Link to={`/post/${_id}`}>
                    <h2>{title}</h2>
                </Link>
                <p className="info">
                    <span className="author">created by @ {author.username}</span>
                    <time>{formatISO9075(new Date(createdAt))}</time>
                </p>
                <p className="summary">{summary}</p>
            </div>
        </div>
    );
}
