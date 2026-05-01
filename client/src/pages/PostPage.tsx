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
        if (!path) return null;
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        const cleanPath = path.replace(/^\/+/, '');
        return `${API_URL}/uploads/${cleanPath}`;
    };

    const imageUrl = getImageUrl(postInfo.cover);

    // Check if the current logged-in user is the author of this post
    const currentUserId = userInfo?.id || userInfo?._id;
    const authorId = postInfo?.author?._id || postInfo?.author?.id;
    const isAuthor = currentUserId && authorId && String(currentUserId) === String(authorId);

    return (
        <div className="max-w-[720px] mx-auto pb-12 px-4 sm:px-0">
            <div className="mb-8">
                <Link to="/" className="inline-flex items-center justify-center w-[38px] h-[38px] rounded-full bg-surface border border-border-custom text-ink-light hover:border-ink hover:text-ink hover:bg-paper-warm transition-all" title="Back to Dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-[17px] h-[17px]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </Link>
            </div>

            <div className="inline-block font-sans text-[0.68rem] font-bold uppercase tracking-widest text-accent-teal mb-2.5">
                {postInfo.category || 'Other'}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight mb-6 text-ink">
                {postInfo.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-border-custom">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-ink text-paper rounded-full flex items-center justify-center font-bold text-sm">
                        {postInfo.author.username[0].toUpperCase()}
                    </div>
                    <span className="font-sans text-[0.875rem] font-medium text-ink-light">created by @ {postInfo.author.username}</span>
                </div>
                <time className="font-sans text-[0.875rem] text-ink-faint">
                    {formatISO9075(new Date(postInfo.createdAt))}
                </time>
            </div>

            {/* Only show Edit/Delete actions if the user is the author */}
            {isAuthor && (
                <div className="flex justify-center gap-2.5 mb-9">
                    <Link className="!inline-flex items-center justify-center w-10 h-10 rounded-lg !bg-surface border !border-border-custom text-ink-light hover:!border-ink hover:!text-ink hover:!bg-paper-warm transition-all p-0" to={`/edit/${postInfo._id}`} title="Edit Post">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[17px] h-[17px]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </Link>
                    <button className="!inline-flex items-center justify-center w-10 h-10 rounded-lg !bg-surface border !border-border-custom text-ink-light hover:!border-red-600 hover:!text-red-600 hover:!bg-red-50 transition-all p-0" onClick={deletePost} title="Delete Post">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[17px] h-[17px]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
            )}

            {imageUrl && (
                <div className="mb-11 rounded-xl overflow-hidden shadow-sm">
                    <img
                        src={imageUrl}
                        alt={postInfo.title}
                        className="w-full h-auto max-h-[52vh] object-cover block"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                        }}
                    />
                </div>
            )}
            
            <div 
                className="font-sans text-[1.1rem] text-ink-light leading-[1.75] [word-spacing:0.02em]
                           [&_p]:mb-6 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:font-serif
                           [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:font-serif
                           [&_a]:text-accent [&_a]:underline [&_a:hover]:text-ink
                           [&_blockquote]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-border-dark [&_blockquote]:italic [&_blockquote]:text-ink-faint [&_blockquote]:my-8"
                dangerouslySetInnerHTML={{ __html: postInfo.content }} 
            />
        </div>
    );
}
