import React, {useCallback, useEffect, useState} from 'react';
import './App.scss';
import {api} from "./api/api"
import Editor from "./components/Editor"
import {Descendant} from "slate";
import {serialize} from "./utils";
import MyNews from './components/MyNews'
import {CustomElement, CustomText} from "./types";
import {Button, Input} from "@mui/material"
import {usePath} from "./components/PathContext";
import Header from "./components/Header";
import Calendar from "./components/Calendar";
import Main from "./components/Main";
import {Dayjs} from "dayjs";
const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ type:"span",text: 'Начните вводить текст...',fontSize:16}],
  },
];
function App() {
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const [title, setTitle] = useState<string>();
  const [id,setId] = useState<{id:string,description:any,title:string}|null>(null); // id - это объект отражающей состояние повторно редактируемого документа
  const [date, setDate] = React.useState<Dayjs | null>(null);
  const {currentRoute,changeRoute} = usePath();
  useEffect(() => {
    if (id?.title) {
      setTitle(id.title);
    }
  }, [id?.title]);
  useEffect(() => {
    if (id?.description) {
      setValue(id.description);
    }
  }, [id?.description]);
  const serializeToHTML = useCallback(() => {

    return value.map(node => serialize(node as CustomElement | CustomText)).join('');
  }, [value]);

  let element = <></>
  switch (currentRoute){
    case "editor":
      element= <>
        <h2 style={{textAlign:"center"}}>Редактор новостей</h2>
        <Input sx={{mb:"20px"}} placeholder={"Введите название статьи"} value={title}
               onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                 setTitle(event.target.value);
               }}></Input>
        <Editor initialValue={id?.description?id.description:initialValue} id={id} setValue={setValue}/>
        <div style={{marginBottom:"40px"}}>
          <h1>Предпросмотр</h1>
          <div dangerouslySetInnerHTML={{__html: serializeToHTML()}} style={{overflowY:"scroll",maxHeight:"30vh",minHeight:"30vh",border:"1px solid black"}}></div>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginBottom:"40px"
        }}>
          <span>Выбор даты для отложенной публикации:</span>
          <Calendar value={date} setValue={setDate} label={"Дата"}></Calendar>
        </div>
        <div style={{display:"flex",justifyContent:"center",marginBottom:"40px"}}>
          <Button onClick={()=>{
            let object_to_send:any ={title:title,
              description:value,
              publish_date:date?.toString(),
              chernovik:false,
              redacted:id?true:false
            }
            if (id) object_to_send._id=id.id
            try {
              api.post(window.env.BACKEND_URL + "/news/sendNews", object_to_send)
              setId(null)
              changeRoute("main")
            }
            catch (e){
              console.log(e)
          }}}>Опубликовать</Button>
          <Button onClick={()=>{
            let object_to_send:any ={title:title,
              description:value,
              publish_date:date?.toString(),
              chernovik:true,
              redacted:id? true : false
            }
            if (id) object_to_send._id=id.id
            try {
              api.post(window.env.BACKEND_URL + "/news/sendNews", object_to_send)
              setId(null)
              changeRoute("myNews")
            }
            catch(err){
              console.log(err)
            }
          }}>Сохранить в черновик</Button>

        </div>
      </>
          break;
    case "main":
      element=<Main></Main>;
      break;
    case "myNews":
      element=<MyNews setId={setId}></MyNews>;
      break;
  }
  return (<div className={"app"}>
        <Header/>
        <div className={"app-content"}>
          {element}
        </div>
  </div>

  );
}

export default App;
