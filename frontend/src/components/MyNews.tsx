import React, {useEffect, useState} from 'react';
import {
    Card,
    CardContent,
    Typography,
    Collapse,
    Box, Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {CustomElement, CustomText,MyNews as MyNewsType} from "../types";
import {serialize} from "../utils";
import {api} from "../api/api"
import ExpandMore from "./ExpandMore";
import {usePath} from "./PathContext";

// Вкладка мои новости
const MyNews = ({setId}:{setId:React.Dispatch<React.SetStateAction<{id:string,description:any,title:string}|null>>}) => {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    let [apiNews,setApiNews]= useState([]);
    const [loading, setLoading] = useState(true);
    const routeChanger = usePath().changeRoute

    useEffect(() => {
        // Добавляем проверку для предотвращения повторных запросов
        if (loading) {
            api.get(`${window.env.BACKEND_URL}/news/myNews/`)
                .then((resp) => {
                    setApiNews(resp.data);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    }, [loading]);

    const handleExpandClick = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                Новости под твоим редакторством
            </Typography>

            {apiNews.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: 'center' }}>
                    Нет новостей для отображения
                </Typography>
            ) : (
                apiNews.map((news:MyNewsType) => (
                    <Card key={news.id} sx={{ mb: 2, boxShadow: 3 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: 2,
                                cursor: 'pointer'
                            }}
                            onClick={() => handleExpandClick(news.id)}
                        >
                            <Typography variant="h6" component="div">
                                {news.title}
                            </Typography>
                            <Button onClick={()=>{
                                setId({id:news._id,description:news.description,title:news.title});
                                routeChanger("editor")
                            }}>
                                Редактировать
                            </Button>
                            <Button onClick={async () => {
                                try {
                                    const response = await api.delete(`${window.env.BACKEND_URL}/news/${news._id}`);
                                    console.log(response);
                                    if (response.status === 200) {
                                        setApiNews(prev =>
                                            prev.filter((val: MyNewsType) => val._id !== news._id)
                                        );
                                    }
                                } catch (error) {
                                    console.error("Ошибка при удалении:", error);
                                    // Можно добавить уведомление для пользователя
                                }
                            }}>
                                Удалить
                            </Button>
                            <ExpandMore
                                expand={expandedId === news.id}
                                aria-expanded={expandedId === news.id}
                            >
                                <ExpandMoreIcon />
                            </ExpandMore>
                        </Box>

                        <Collapse in={expandedId === news.id} timeout="auto" unmountOnExit>
                            <CardContent>
                                <Typography variant="body1" dangerouslySetInnerHTML={{__html:
                                        news.description.map(node => serialize(node as CustomElement | CustomText)).join('')}}>

                                </Typography>
                            </CardContent>
                        </Collapse>
                    </Card>
                ))
            )}
        </Box>
    );
};

export default MyNews;