import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import Post from "../Post";
import { UserContext } from "../UserContext";
import type { PostData } from "./IndexPage";
import { API_URL } from "../config";

export default function UserPostsPage() {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { userInfo } = useContext(UserContext);
    const { id } = useParams<{ id: string }>(); 
    
    const isOwner = userInfo?.id === id;

    useEffect(() => {
        setIsLoading(true);
        fetch(`${API_URL}/post/user/${id}`).then(response => {
            response.json().then(posts => {
                setPosts(posts);
                setIsLoading(false);
            });
        }).catch(() => setIsLoading(false));
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-ink-faint gap-4">
                <div className="w-7 h-7 border-2 border-border-custom border-t-ink rounded-full animate-spin"></div>
                <p className="text-[0.9rem]">Retrieving your stories...</p>
            </div>
        );
    }

    return (
        <div className="py-4">
            <div className="flex items-center gap-5 mb-10 border-b border-border-custom pb-6">
                <Link to="/" className="inline-flex items-center justify-center w-[38px] h-[38px] rounded-full bg-surface border border-border-custom text-ink-light hover:border-ink hover:text-ink hover:bg-paper-warm transition-all" title="Back to Dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-[17px] h-[17px]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </Link>
                <h1 className="text-3xl font-bold font-serif text-ink">{isOwner ? "My Blogs" : "User's Blogs"}</h1>
            </div>
            
            {posts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 pt-2">
                    {posts.map(post => (
                        <Post key={post._id} {...post} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-ink-faint py-15 text-base">
                    {isOwner ? "You haven't created any posts yet." : "This user has no posts."}
                </div>
            )}
        </div>
    );
}
