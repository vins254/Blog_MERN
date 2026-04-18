import React, { useEffect, useState, FormEvent } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";
import CATEGORIES from "../constants/categories";
import { API_URL } from "../config";

export default function EditPost() {
    const { id } = useParams<{ id: string }>();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState<FileList | null>(null);
    const [category, setCategory] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            fetch(`${API_URL}/post/` + id)
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch post data');
                    return response.json();
                })
                .then(postInfo => {
                    setTitle(postInfo.title);
                    setContent(postInfo.content);
                    setSummary(postInfo.summary);
                    setCategory(postInfo.category || 'Other');
                })
                .catch(err => {
                    console.error('Edit fetch error:', err);
                    setError('Failed to load post data');
                });
        }
    }, [id]);
    async function updatePost(ev: FormEvent) {
        ev.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('category', category);
        data.set('id', id || '');
        if (files?.[0]) {
            data.set('file', files[0]);
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/post`, {
                method: 'PUT',
                body: data,
                credentials: 'include',
            });
            if (response.ok) {
                setRedirect(true);
            } else {
                const errData = await response.json();
                setError(errData.message || 'Failed to update post');
                setIsSubmitting(false);
            }
        } catch (e) {
            console.error('Fetch error:', e);
            setError('Server connection error. Please check your internet or if the server is running.');
            setIsSubmitting(false);
        }
    }

    if (redirect) {
        return <Navigate to={'/post/' + id} />
    }

    return (
        <form className="post-form" onSubmit={updatePost}>
            <div className="page-actions-top">
                <Link to={`/post/${id}`} className="icon-back-btn" title="Back to Post">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </Link>
            </div>
            <h1 className="form-title">Edit Post</h1>
            {error && <div className="error-message">{error}</div>}
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
            <button style={{ marginTop: '5px' }} disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Post'}
            </button>
        </form>
    );
}
