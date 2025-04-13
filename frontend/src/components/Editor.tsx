import React, {useState, useCallback, useEffect} from 'react';
import { createEditor,  Descendant } from 'slate';
import {Slate, Editable, withReact, ReactEditor, RenderLeafProps} from 'slate-react';
import { CustomElement, CustomText } from '../types';
import {BlockButton, MarkButton} from "./Button";
import {toggleMark, isBlockActive, uploadFile} from "../utils";
import {FormatBold, FormatItalic, FormatUnderlined, FormatQuote, StrikethroughS} from "@mui/icons-material"
import {MarkdownIcon} from "./Icons";
import {withMarkdown} from "../markdownMode";
import {FontSizeDropdown} from "./FontSizeDropdown";
import {ImageElement, FileElement, FileUploader} from "./customElements";
import "./Editor.scss"
import {withFiles} from "../fileUploadMode";
// Расширяем стандартные типы Slate
declare module 'slate' {
    interface CustomTypes {
        Editor: ReactEditor;
        Element: CustomElement;
        Text: CustomText;
    }
}

interface EditorProps {
    initialValue: Descendant[];
    setValue: (value: Descendant[]) => void;
    id:{
        id:string;
        description:any;
    }|null;
}

const RichEditor = ({initialValue,setValue,id}:EditorProps) => {
    const [editor] = useState(() => withFiles(
            withMarkdown(
                withReact(
                    createEditor()
                )
            )
        )
    );

    // Обработка drag&drop
    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            Array.from(files).forEach(async (file)=>uploadFile(editor,file))
        }
    };
    // Обработка вставки из буфера обмена

    const handlePaste = (event: React.ClipboardEvent) => {
        const files = event.clipboardData.files;
        if (files.length > 0) {
            event.preventDefault();
            Array.from(files).forEach(async (file)=>uploadFile(editor,file))
        }
    };
    // Рендер элементов с проверкой типов
    const renderElement = useCallback((props: any) => {
        switch (props.element.type) {
            case "img":
                return <ImageElement {...props} />;
            case "file":
                return <FileElement {...props} />;
            case "blockquote":
                return <blockquote {...props} />
            default: // Тег p
                return <DefaultElement {...props} />;
        }
    }, []);

    // Рендер текстовых узлов
    const renderLeaf = useCallback((props: RenderLeafProps|CustomText) => {
        return <Leaf {...props} />;
    }, []);
    // Подсказка о работе с режимом Markdown
    const MarkdownModeHint = ({active}:{active:boolean})=>{
        if (active) return <span>Enter - для переноса строки. Shift+Enter для создания нового блока</span>
        else return <></>
    }
    return (
        <div className="editor_container">
            <Slate editor={editor} initialValue={initialValue} onChange={setValue}>
                <div className={"editor_header"}>
                    <div className="toolbar">
                        <MarkButton format="bold" icon={FormatBold} />
                        <MarkButton format="italic" icon={FormatItalic} />
                        <MarkButton format="underline" icon={FormatUnderlined} />
                        <MarkButton format="strike" icon={StrikethroughS} />
                        <BlockButton block="blockquote" icon={FormatQuote} />
                        <BlockButton block="markdown" icon={MarkdownIcon}></BlockButton>
                        <FontSizeDropdown></FontSizeDropdown>
                        <div style={{marginTop:"12px"}}>
                            <FileUploader></FileUploader>
                        </div>

                    </div>
                    <MarkdownModeHint active={isBlockActive(editor,"markdown")}/>

                </div>
                <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    className={"editor_window"}
                    onDrop={handleDrop}
                    onPaste={handlePaste}
                    // некоторые хоткеи
                    onKeyDown={(event) => {
                        if (!event.ctrlKey) return;
                        switch (event.key.toLowerCase()) {
                            case 'b':
                                event.preventDefault();
                                toggleMark(editor, 'bold');
                                break;
                            case 'i':
                                event.preventDefault();
                                toggleMark(editor, 'italic');
                                break;
                            case 'u':
                                event.preventDefault();
                                toggleMark(editor, 'underline');
                                break;
                        }
                    }}
                />
            </Slate>
        </div>
    );
};




const DefaultElement: React.FC<any> = ({ attributes, children }) => {
    return <p {...attributes}>{children}</p>;
};

const Leaf: React.FC<any> = ({ attributes, children, leaf }) => {
    let content = children;
    if (leaf.bold) content = <strong>{content}</strong>;
    if (leaf.italic) content = <em>{content}</em>;
    if (leaf.underline) content = <u>{content}</u>;
    if (leaf.strike) content = <del>{content}</del>;
    // Обработка заголовков
    if (leaf.type && ["h1","h2","h3","h4","h5"].includes(leaf.type)) {
        return <leaf.type {...attributes}>{content}</leaf.type>;
    }

    // Обработка размера шрифта
    const style = { fontSize: leaf.fontSize ? `${leaf.fontSize}px` : 'inherit' };

    return <span {...attributes} style={style}>{content}</span>;
};


export default RichEditor;