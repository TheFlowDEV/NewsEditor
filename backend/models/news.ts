export type Span = {
    type:"span"|"small"|"sub"|"sup"|"link",
    text:string
    bold?:boolean
    italic?:boolean
    underline?:boolean
    strike?:boolean
    fontSize:number
}
export type Block = {
    type:'paragraph' | "img"  | "markdown" | "blockquote"| "h5" | "h4" | "h3" | "h2" | "h1";
    children:Span[]
    url?:string;
    filename?:string;
}
export type News = {
    title:string,
    description: Block[];
    publish_date:Date;
    published:boolean;
    authorId:number //user_id
}