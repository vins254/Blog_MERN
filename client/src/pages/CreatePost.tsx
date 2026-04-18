import React, { useState, FormEvent } from "react";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";
import CATEGORIES from "../constants/categories";

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState<FileList | null>(null);
    const [category, setCategory] = useState('Other');
    const [redirect, setRedirect] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    async function createNewPost(ev: FormEvent) {
        ev.preventDefault();
        
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        setError('');

        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('category', category);
        if (files && files[0]) {
            data.set('file', files[0]);
        }
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/post`, {
                method: 'POST',
                body: data,
                credentials: 'include',
            });
            if (response.ok) {
                setRedirect(true);
            } else {
                const errData = await response.json();
                setError(errData.message || 'Failed to create post');
                setIsSubmitting(false);
            }
        } catch (e) {
            console.error('Fetch error:', e);
            setError('Server connection error. Please check your internet or if the server is running.');
            setIsSubmitting(false);
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }
    return (
        <form className="post-form" onSubmit={createNewPost}>
            <h1 className="form-title">Create New Post</h1>
            {error && <div className="error-message">{error}</div>}
            
            <input type="text" 
                    placeholder={'Title'} 
                    value={title}
                    onChange={ev => setTitle(ev.target.value)} 
                    required />
            <input type="text" 
                    placeholder={'Summary'} 
                    value={summary}
                    onChange={ev => setSummary(ev.target.value)} 
                    required />
            <select value={category} onChange={ev => setCategory(ev.target.value)}>
                {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
            </select>
            <input type="file" 
                    onChange={ev => setFiles(ev.target.files)}/>
            <Editor value={content} onChange={setContent} />
            <button style={{ marginTop: '15px' }} disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Post'}
            </button>
        </form>
    );
}
