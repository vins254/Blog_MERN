import React, { useEffect, useState, useContext } from "react";
import Post from "../Post";
import { UserContext } from "../UserContext";
import { API_URL } from "../config";

export interface PostData {
    _id: string;
    title: string;
    summary: string;
    content: string;
    cover: string;
    createdAt: string;
    category?: string;
    author: {
        _id: string;
        username: string;
    };
}

export default function IndexPage() {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { searchQuery } = useContext(UserContext);

    useEffect(() => {
        setIsLoading(true);
        fetch(`${API_URL}/post`)
            .then(response => response.json())
            .then(posts => {
                setPosts(posts);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Curating stories for you...</p>
            </div>
        );
    }

    return (
        <>
            {filteredPosts.length > 0 ? (
                <div className="posts-container">
                    {filteredPosts.map(post => (
                        <Post key={post._id} {...post} />
                    ))}
                </div>
            ) : (
                <div className="no-results">
                    {searchQuery ? `No posts found matching "${searchQuery}"` : "No posts available at the moment."}
                </div>
            )}
        </>
    );
}
