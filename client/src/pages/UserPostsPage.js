import {useEffect, useState, useContext} from "react";
import { useParams, Link } from "react-router-dom";
import Post from "../Post";
import { UserContext } from "../UserContext";

export default function UserPostsPage() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const {userInfo} = useContext(UserContext);
    const {id} = useParams(); 
    
    const isOwner = userInfo?.id === id;

    useEffect(() => {
        setIsLoading(true);
        fetch(`${process.env.REACT_APP_API_URL}/post/user/${id}`).then(response => {
            response.json().then(posts => {
                setPosts(posts);
                setIsLoading(false);
            });
        }).catch(() => setIsLoading(false));
    }, [id]);

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Retrieving your stories...</p>
            </div>
        );
    }

    return (
        <div className="user-posts-page">
            <div className="page-header">
                <div className="title-section">
                    <Link to="/" className="icon-back-btn" title="Back to Dashboard">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </Link>
                    <h1>{isOwner ? "My Blogs" : "User's Blogs"}</h1>
                </div>
            </div>
            
            {posts.length > 0 ? (
                <div className="posts-container">
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
