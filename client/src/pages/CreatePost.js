import "react-quill/dist/quill.snow.css";
import {useState} from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";


export default function CreatePost() {
    const [title,setTitle] = useState('');
    const [summary,setSummary] = useState('');
    const [content,setContent] = useState('');
    const [files, setFiles] = useState(null);
    const [category, setCategory] = useState('Other');
    const [redirect, setRedirect] = useState(false);
    async function createNewPost(ev) {
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('category', category);
        if (files && files[0]) {
            data.set('file', files[0]);
        }
        
        ev.preventDefault();
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}/post`, {
            method: 'POST',
            body: data,
            credentials: 'include',
        });
        if (response.ok) {
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }
    return (
        <form onSubmit={createNewPost}>
            <input type="title" 
                    placeholder={'Title'} 
                    value={title}
                    onChange={ev => setTitle(ev.target.value)} />
            <input type="summary" 
                    placeholder={'Summary'} 
                    value={summary}
                    onChange={ev => setSummary(ev.target.value)} />
            <select value={category} onChange={ev => setCategory(ev.target.value)}>
                <option value="Tech">Tech</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Travel">Travel</option>
                <option value="Finance">Finance</option>
                <option value="Other">Other</option>
            </select>
            <input type="file" 
                    //value={files} 
                    onChange={ev => setFiles(ev.target.files)}/>
            <Editor value={content} onChange={setContent} />
            <button style={{marginTop:'5px'}}>Create Post</button>
        </form>
    );
}