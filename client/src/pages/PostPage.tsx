import React, { useContext, useEffect, useState } from "react";
import { formatISO9075 } from "date-fns";
import { useParams, Navigate, Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import type { PostData } from "./IndexPage";
import { API_URL } from "../config";

/**
 * PostPage Component
 * Displays the full content of a single blog post.
 * Includes edit and delete functionality for the post author.
 */
export default function PostPage() {
    const [postInfo, setPostInfo] = useState<PostData | null>(null);
    const { userInfo } = useContext(UserContext);
    const { id } = useParams<{ id: string }>();
    const [deleteRedirect, setDeleteRedirect] = useState(false);

    // Fetch post data on component mount or when ID changes
    useEffect(() => {
        fetch(`${API_URL}/post/${id}`)
            .then(response => {
                response.json().then(postInfo => {
                    setPostInfo(postInfo);
                });
            });
    }, [id]);

    /**
     * Handles post deletion.
     * Requires confirmation and redirects to user's post list on success.
     */
    async function deletePost() {
        if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }
        
        const response = await fetch(`${API_URL}/post/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.ok) {
            setDeleteRedirect(true);
        }
    }

    // Redirect after successful deletion
    if (deleteRedirect) {
        return <Navigate to={`/posts/user/${userInfo?.id || userInfo?._id}`} />;
    }

    if (!postInfo) return null;

    /**
     * Normalizes image paths to absolute URLs.
     */
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

    // Check if the current logged-in user is the author of this post
    // We check both .id and ._id for robustness across different API response formats
    const currentUserId = userInfo?.id || userInfo?._id;
    const authorId = postInfo?.author?._id || postInfo?.author?.id;
    const isAuthor = currentUserId && authorId && String(currentUserId) === String(authorId);

    return (
        <div className="post-page">
            <div className="page-actions-top">
                <Link to="/" className="icon-back-btn" title="Back to Dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </Link>
            </div>

            <div className="category-badge">{postInfo.category || 'Other'}</div>
            <h1>{postInfo.title}</h1>
            
            <div className="post-meta">
                <div className="author-info">
                    <div className="author-avatar">{postInfo.author.username[0].toUpperCase()}</div>
                    <span>created by @ {postInfo.author.username}</span>
                </div>
                <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
            </div>

            {/* Only show Edit/Delete actions if the user is the author */}
            {isAuthor && (
                <div className="edit-row">
                    <Link className="edit-action-btn" to={`/edit/${postInfo._id}`} title="Edit Post">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </Link>
                    <button className="delete-action-btn" onClick={deletePost} title="Delete Post">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
            )}

            <div className="post-banner">
                <img 
                    src={getImageUrl(postInfo.cover)} 
                    alt={postInfo.title} 
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop';
                    }}
                />
            </div>
            
            <div className="content" dangerouslySetInnerHTML={{ __html: postInfo.content }} />
        </div>
    );
}
