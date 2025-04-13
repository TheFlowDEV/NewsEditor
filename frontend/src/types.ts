export type CustomElement =
    {
        type: 'paragraph' | 'link' | "markdown" | "blockquote"| "h5" | "h4" | "h3" | "h2" | "h1" |"img"|"file";
        children: CustomText[];
        url?: string;
        fileName?:string;
    };
export type CustomText =
    {
        type:"span"|"small"|"sub"|"sup"|"a"
        text: string;
        bold?:boolean;
        italic?:boolean;
        underline?:boolean;
        strike?: boolean
        fontSize:number;
    };
export type News = {
        id:number;
        title: string;
        description: CustomElement[];
        publish_date:Date;
        published:boolean;
        author:number //user_id
}
export type MyNews = {
        _id:string;
        id:number;
        title: string;
        description: CustomElement[];
        publish_date:Date;
        published:boolean;
        author:number //user_id
}