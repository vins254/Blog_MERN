import {useEffect, useState, useContext} from "react";
import { useParams, Link } from "react-router-dom";
import Post from "../Post";
import { UserContext } from "../UserContext";

export default function UserPostsPage() {
    const [posts, setPosts] = useState([]);
    const {userInfo} = useContext(UserContext);
    const {id} = useParams(); // ID from URL, can be own or someone else's
    
    const isOwner = userInfo?.id === id;

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/post/user/${id}`).then(response => {
            response.json().then(posts => {
                setPosts(posts);
            });
        });
    }, [id]);

    return (
        <div className="user-posts-page">
            <div className="page-header">
                <h1>{isOwner ? "My Blogs" : "User's Blogs"}</h1>
                <Link to="/" className="back-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to Dashboard
                </Link>
            </div>
            
            {posts.length > 0 ? (
                <div className="posts-grid">
                    {posts.map(post => (
                        <Post key={post._id} {...post} />
                    ))}
                </div>
            ) : (
                <div className="no-results">
                    {isOwner ? "You haven't created any posts yet." : "This user has no posts."}
                </div>
            )}
        </div>
    );
}
