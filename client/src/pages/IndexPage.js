import { useEffect, useState, useContext} from "react";
import Post from "../Post";
import { UserContext } from "../UserContext";

export default function IndexPage() {
    const [posts, setPosts] = useState([]);
    const {searchQuery} = useContext(UserContext);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/post`).then(response => {
            response.json().then(posts => {
                setPosts(posts);
            });
        });
    }, []);

    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return(
        <>
            {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                    <Post key={post._id} {...post} />
                ))
            ) : (
                <div className="no-results">
                    {searchQuery ? `No posts found matching "${searchQuery}"` : "No posts available."}
                </div>
            )}
        </>
    );
}