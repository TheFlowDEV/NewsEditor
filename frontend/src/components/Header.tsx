import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import {useAuth} from "./AuthContext"
import {usePath} from "./PathContext";
import {useAuthModal} from "./AuthModal";
// Вкладка header

export default function Header() {
    const isAuthenticated = useAuth().isAuthenticated;
    const { openAuthModal } = useAuthModal();
    const pathContext = usePath();
    let contentToShow =<></>
    if (isAuthenticated) {
        contentToShow = <span><Button color="inherit" onClick={()=>pathContext.changeRoute("editor")}>Редактор</Button>
            <Button color="inherit" onClick={()=>pathContext.changeRoute("myNews")}>Мои новости</Button></span>
    }
    else{
        contentToShow = <Button color="inherit" onClick={()=>openAuthModal('login')}>Войти</Button>
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="span" sx={{ flexGrow: 1}}>
                        Новости
                    </Typography>
                    <Button color="inherit" onClick={()=>pathContext.changeRoute("main")}>Главная</Button>
                    {contentToShow}
                </Toolbar>
            </AppBar>
        </Box>
    );
}