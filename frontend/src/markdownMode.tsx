import { Editor,Element} from "slate";
import {ReactEditor} from "slate-react";
import {CustomElement, CustomText} from "./types";
declare module 'slate' {
    interface CustomTypes {
        Editor: ReactEditor;
        Element: CustomElement;
        Text: CustomText;
    }
}



const isMarkdown = (editor: Editor) => {
    const [match] = Array.from(Editor.nodes(editor, {
        match: n => {
            if (!Editor.isEditor(n) && Element.isElement(n)) return n.type === 'markdown'
            return false;
        }
        },
    ));
    return !!match;
};

export const withMarkdown = (editor: Editor) => {
    const { insertBreak, insertText } = editor;

    editor.insertBreak = () => {
        if (isMarkdown(editor)) {
            // Внутри code-block: добавляем новую строку вместо нового блока
            insertText('\n');
        } else {
            insertBreak();
        }
    };

    return editor;
};

