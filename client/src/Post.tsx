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
        if (!path) return '';
        // Handle potential absolute URLs or base64 (though unlikely here)
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        
        const cleanPath = path.replace(/^\/+/, "");
        return `${API_URL}/uploads/${cleanPath}`;
    };

    return (
        <div className="post">
            <div className="image">
                <Link to={`/post/${_id}`}>
                    <img src={getImageUrl(cover)} alt={title} />
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
