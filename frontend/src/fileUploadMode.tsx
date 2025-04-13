import {Editor} from "slate";
import {insertFile, insertImage} from "./utils";
import {api} from "./api/api";

export const withFiles = (editor: Editor) => {
    const { insertData, isVoid } = editor

    editor.isVoid = element => {
        return element.type === 'img' || element.type === 'file'
            ? true
            : isVoid(element)
    }

    editor.insertData = (data: DataTransfer) => {
        const files = data.files

        if (files && files.length > 0) {
            Array.from(files).forEach(async file => {
                const [mime] = file.type.split('/')
                const reader = new FileReader()

                reader.addEventListener('load', async () => {
                    try {
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
                    } catch (error) {
                        console.error('Ошибка загрузки файла:', error)
                    }
                })

                reader.readAsDataURL(file)
            })
        } else {
            insertData(data)
        }
    }

    return editor
}