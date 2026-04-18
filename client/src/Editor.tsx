import React from "react";
import ReactQuill from "react-quill";

interface EditorProps {
    value: string;
    onChange: (content: string) => void;
}

export default function Editor({ value, onChange }: EditorProps) {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ]
    };

    return (
        <ReactQuill 
            value={value} 
            theme={'snow'}
            onChange={onChange}
            modules={modules} />
    );
}
