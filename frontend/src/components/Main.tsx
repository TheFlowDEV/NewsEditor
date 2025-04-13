import React, {useEffect, useState} from 'react';
import {
    Card,
    CardContent,
    Typography,
    Collapse,
    Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {CustomElement, CustomText, News} from "../types";
import {serialize} from "../utils";
import {api} from "../api/api"
import ExpandMore from "./ExpandMore"


// Вкладка Главная

const Main = () => {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    let [apiNews,setApiNews]= useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Добавляем проверку для предотвращения повторных запросов
        if (loading) {
            api.get(`${window.env.BACKEND_URL}/news/`)
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
                Последние новости
            </Typography>

            {apiNews.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: 'center' }}>
                    Нет новостей для отображения
                </Typography>
            ) : (
                apiNews.map((news:News) => (
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

export default Main;