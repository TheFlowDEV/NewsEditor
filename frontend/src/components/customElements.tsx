import React, {useState,useRef} from "react";
import {InsertDriveFile} from "@mui/icons-material";
import {Button,CircularProgress} from "@mui/material"
import {useSlate} from "slate-react";
import {insertFile, insertImage} from "../utils";
import {api} from "../api/api";
export const ImageElement: React.FC<any> = ({ attributes, children, element }) => {
    return (
        <div {...attributes}>
            <div contentEditable={false}>
                <img
                    src={element.url}
                    alt="uploaded content"
                    style={{
                        maxWidth: '100%',
                        height: 'auto',
                        display: 'block',
                        margin: '10px 0'
                    }}
                />
            </div>
            {children}
        </div>
    );
};

export const FileElement: React.FC<any> = ({ attributes, children, element }) => {
    return (
        <div {...attributes}>
            <div contentEditable={false}>
                <a
                    href={element.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                    }}
                >
                    <InsertDriveFile style={{ marginRight: 8 }} />
                    {element.fileName}
                </a>
            </div>
            {children}
        </div>
    );
};

export const FileUploader = () => {
    const editor = useSlate();
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadFile = async (file: File) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post(window.env.BACKEND_URL+"/news/uploadFile", formData)

            const { url } = await response.data

            if (file.type.startsWith('image/')) {
                insertImage(editor, url);
            } else {
                insertFile(editor, url, file.name);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('File upload failed');
        } finally {
            setIsLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) uploadFile(file);
    };

    return (
        <label>
            <input
                type="file"
                accept="image/*, .pdf, .doc, .docx"
                onChange={handleFileInput}
                style={{ display: 'none' }}
                ref={fileInputRef}
            />
            <Button
                variant="contained"
                component="span"
                disabled={isLoading}
            >
                {isLoading ? <CircularProgress size={24} /> : 'Загрузить файл'}
            </Button>
        </label>
    );
};

