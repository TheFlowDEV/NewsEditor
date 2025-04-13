import {Editor, Text, Element, Transforms} from "slate";
import {CustomText,CustomElement} from "./types";
import escapeHtml from 'escape-html'
import {ReactEditor} from "slate-react";
import {markdown} from "./markdownToHTML"
import {api} from "./api/api";

declare module 'slate' {
    interface CustomTypes {
        Editor: ReactEditor;
        Element: CustomElement;
        Text: CustomText;
    }
}

/*
* Функция для того, чтобы узнать активен ли режим редактирования строки
* @param {Editor} editor - объект редактора slate.js
* @param {Omit<CustomText["type"],'text'>} format - интересуемый режим
* @returns boolean
* */export const isMarkActive = (editor: Editor, format: keyof Omit<CustomText, 'text'>): boolean => {
    const marks = Editor.marks(editor) as Omit<CustomText, 'text'>;
    if (marks?.[format]) return true;
    return false;
};

/*
*/
export const toggleMark = (editor: Editor, format: keyof Omit<CustomText, 'text'>): void => {
    const isActive = isMarkActive(editor, format);
    if (isActive){
        Editor.removeMark(editor, format);
    }
    else{
        Editor.addMark(editor,format,true);
    }
};

export const serialize = (node: CustomText|CustomElement):string => {
    if (Text.isText(node)) {
        let string = escapeHtml(node.text)
        if (node.underline){
            string = `<u>${string}</u>`
        }
        if (node.italic){
            string = `<i>${string}</i>`
        }
        if (node.bold) {
            string = `<strong>${string}</strong>`
        }
        if (node.strike){
            string = `<del>${string}</del>`
        }
        string = `<${node.type} style=font-size:${node.fontSize}px>${string}</${node.type}>`
        return string
    }
    let children:string = "";
    if (node.type==="markdown") {
        children = node.children.map(n => n.text).join('');
    }
    else if (node.type==="img") children = ""
    else children = node.children.map(n => serialize(n)).join('')

    switch (node.type) {
        case 'paragraph':
            return `<p>${children}</p>`
        case 'blockquote':
            return `<blockquote>${children}</blockquote>`
        case 'link':
            return `<a href="${escapeHtml(node.url)}">${children}</a>`
        case 'markdown':
            return markdown.render(children)
        case 'img':
            return `<img src="${escapeHtml(node.url)}" alt="произошла ошибка загрузки изображения"/>`
        case 'file':
            return `
                <div>
                    <a href="${escapeHtml(node.url)}" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       style="
                           display: inline-flex;
                           align-items: center;
                           padding: 8px 12px;
                           border: 1px solid #ddd;
                           border-radius: 4px;
                           text-decoration: none;
                           color: inherit;
                       ">
                        <!-- Иконка файла как SVG -->
                        <svg 
                            viewBox="0 0 24 24" 
                            style="
                                width: 16px; 
                                height: 16px; 
                                margin-right: 8px;
                                fill: currentColor;
                            ">
                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                        </svg>
                        ${escapeHtml(node.fileName)}
                    </a>
                </div>
            `;
        default:
            return children
    }
}
/*
* Функция для того, чтобы узнать активен ли режим редактирования блока
* @param {Editor} editor - объект редактора slate.js
* @param {CustomElement["type"]} format - интересуемый режим
* @returns boolean
* */
export const isBlockActive = (editor: Editor, format: CustomElement["type"]) => {
    const { selection } = editor
    if (!selection) return false

    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: n => {
                if (!Editor.isEditor(n) && Element.isElement(n)) {
                    return n.type === format
                }
                return false
            },
        })
    )
    return !!match
};
export const insertImage = (editor: Editor, url: string) => {
    const image: CustomElement = {
        type: 'img',
        url,
        children: [{type:"span", text: '' ,fontSize:16}],
    };
    Transforms.insertNodes(editor, image);
    Transforms.insertNodes(editor, {type:"paragraph", children: [{type:"span", text: '' ,fontSize:16}],});

};

export const insertFile = (editor: Editor, url: string, filename: string) => {
    const fileElement: CustomElement = {
        type: 'file',
        url:url,
        fileName:filename,
        children: [{type:"span", text: '' ,fontSize:16}],
    };
    Transforms.insertNodes(editor, fileElement);
    Transforms.insertNodes(editor, {type:"paragraph", children: [{type:"span", text: '' ,fontSize:16}],});
};
export const uploadFile = async (editor: Editor, file:File) => {
    const [mime] = file.type.split('/')
    const formData = new FormData();
    formData.append('file', file);
    // Загрузка на сервер
    const response = await api.post(window.env.BACKEND_URL+"/news/uploadFile", formData)
    const { url } = await response.data
    // Вставка элемента
    if (mime === 'image') {
        insertImage(editor, url)
    } else {
        insertFile(editor, url, file.name)
    }
};

let openAuthModalExternal: ((mode: 'login' | 'register') => void) | null = null;

export function setOpenAuthModal(cb: typeof openAuthModalExternal) {
    openAuthModalExternal = cb;
}

export function triggerOpenAuthModal(mode: 'login' | 'register') {
    openAuthModalExternal?.(mode);
}
