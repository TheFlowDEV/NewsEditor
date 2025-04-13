import hljs from "highlight.js";
import MarkdownIt from "markdown-it";
import 'highlight.js/styles/default.css'


const markdown: MarkdownIt = MarkdownIt({
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, {
                    language: lang,
                    ignoreIllegals: true
                }).value;
            } catch (error) {
                console.error('Error during highlighting:', error);
            }
        }

        try {
            return hljs.highlightAuto(str).value;
        } catch (error) {
            console.error('Error during auto highlighting:', error);
            return markdown.utils.escapeHtml(str);
        }
    },
});

export { markdown };