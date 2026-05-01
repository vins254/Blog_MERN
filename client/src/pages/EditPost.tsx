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
        <form className="max-w-[800px] mx-auto pt-6 pb-20 px-4 flex flex-col" onSubmit={updatePost}>
            <div className="mb-6">
                <Link to={`/post/${id}`} className="inline-flex items-center justify-center w-[38px] h-[38px] rounded-full bg-surface border border-border-custom text-ink-light hover:border-ink hover:text-ink hover:bg-paper-warm transition-all" title="Back to Post">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-[17px] h-[17px]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </Link>
            </div>

            <h1 className="text-3xl font-bold font-serif mb-8 text-ink">Edit Post</h1>
            
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-lg text-[0.875rem] font-medium text-center mb-8 animate-in fade-in duration-200">
                    {error}
                </div>
            )}
            
            <div className="space-y-4">
                <input 
                    type="text" 
                    placeholder={'Title'} 
                    className="w-full p-3.5 bg-paper-warm border border-border-custom rounded-lg font-sans text-lg font-semibold text-ink outline-none transition-all focus:border-ink-light focus:bg-surface focus:shadow-xs"
                    value={title}
                    onChange={ev => setTitle(ev.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder={'Summary'} 
                    className="w-full p-3.5 bg-paper-warm border border-border-custom rounded-lg font-sans text-base text-ink outline-none transition-all focus:border-ink-light focus:bg-surface focus:shadow-xs"
                    value={summary}
                    onChange={ev => setSummary(ev.target.value)} 
                    required 
                />
                <div className="flex flex-col sm:flex-row gap-4">
                    <select 
                        value={category} 
                        onChange={ev => setCategory(ev.target.value)}
                        className="flex-1 p-3.5 bg-paper-warm border border-border-custom rounded-lg font-sans text-base text-ink outline-none transition-all focus:border-ink-light focus:bg-surface cursor-pointer appearance-none"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                    <input 
                        type="file" 
                        className="flex-1 p-3.5 bg-paper-warm border border-border-custom rounded-lg font-sans text-sm text-ink-light outline-none file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-ink file:text-paper hover:file:bg-accent cursor-pointer"
                        onChange={ev => setFiles(ev.target.files)}
                    />
                </div>
            </div>

            <div className="mt-6 bg-surface border border-border-custom rounded-lg overflow-hidden">
                <Editor onChange={setContent} value={content} />
            </div>

            <button 
                type="submit" 
                disabled={isSubmitting}
                className="mt-8 p-4 bg-ink text-paper rounded-lg font-sans text-base font-semibold border-none cursor-pointer transition-all hover:bg-accent disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
                {isSubmitting ? 'Updating...' : 'Update Post'}
            </button>
        </form>
    );
}
