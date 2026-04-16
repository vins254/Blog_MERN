import {useEffect, useState} from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";


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
        <form onSubmit={updatePost}>
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
                <option value="Business">Business</option>
                <option value="Health">Health & Fitness</option>
                <option value="Education">Education</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Food">Food & Cooking</option>
                <option value="Fashion">Fashion & Beauty</option>
                <option value="Science">Science</option>
                <option value="Environment">Environment</option>
                <option value="Politics">Politics</option>
                <option value="Sports">Sports</option>
                <option value="Gaming">Gaming</option>
                <option value="DIY">DIY & Crafts</option>
                <option value="Art">Arts & Culture</option>
                <option value="Photography">Photography</option>
                <option value="News">News & Media</option>
                <option value="Other">Other</option>
            </select>
            <input type="file" 
                    //value={files} 
                    onChange={ev => setFiles(ev.target.files)}/>
            <Editor onChange={setContent} value={content} />
            <button style={{marginTop:'5px'}}>Update Post</button>
        </form>
    );
}