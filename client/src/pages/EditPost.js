import {useEffect, useState} from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";
import CATEGORIES from "../constants/categories";


export default function EditPost() {
    const {id} = useParams();
    const [title,setTitle] = useState('');
    const [summary,setSummary] = useState('');
    const [content,setContent] = useState('');
    const [files, setFiles] = useState('');
    const [category, setCategory] = useState('');
    const [redirect, setRedirect] = useState(false);
    
   
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/post/`+id)
            .then(response => {
                response.json().then(postInfo => {
                    setTitle(postInfo.title);
                    setContent(postInfo.content);
                    setSummary(postInfo.summary);
                    setCategory(postInfo.category || 'Other');
                });
            });
    }, [id]);

    async function updatePost(ev) {
        ev.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('category', category);
        data.set('id', id);
        if (files?.[0]) {
            data.set('file', files?.[0]);
        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}/post`, {
            method: 'PUT',
            body: data,
            credentials: 'include',
        });
        if (response.ok) {
            setRedirect(true);
        }
        
    }

    if (redirect) {
        return <Navigate to={'/post/'+id} />
    }

    return (
        <form className="post-form" onSubmit={updatePost}>
            <div className="page-actions-top">
                <Link to={`/post/${id}`} className="back-link">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to Post
                </Link>
            </div>
            <h1 className="form-title">Edit Post</h1>
            <input type="text" 
                    placeholder={'Title'} 
                    value={title}
                    onChange={ev => setTitle(ev.target.value)} />
            <input type="text" 
                    placeholder={'Summary'} 
                    value={summary}
                    onChange={ev => setSummary(ev.target.value)} />
            <select value={category} onChange={ev => setCategory(ev.target.value)}>
                {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
            </select>
            <input type="file" 
                    onChange={ev => setFiles(ev.target.files)}/>
            <Editor onChange={setContent} value={content} />
            <button style={{marginTop:'5px'}}>Update Post</button>
        </form>
    );
}