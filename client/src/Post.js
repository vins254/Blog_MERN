import {Link} from "react-router-dom";
import {formatISO9075} from "date-fns";

export default function Post({_id,title,summary,cover,createdAt,author,category}) {
    // Robust image URL handling
    const getImageUrl = (path) => {
        if (!path) return '';
        const baseUrl = process.env.REACT_APP_API_URL.replace(/\/+$/, "");
        const cleanPath = path.replace(/^\/+/, "");
        return `${baseUrl}/uploads/${cleanPath}`;
    };

    return(
        <div className="post">
            <div className="image">
                <Link to={`/post/${_id}`}>
                    <img src={getImageUrl(cover)} alt={title}/>
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