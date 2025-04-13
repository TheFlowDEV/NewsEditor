// Компонент модального окна регистрации или входа
import {createContext, useContext, useState} from "react";
import { Dialog, Tabs, Tab, TextField, Button, Box } from '@mui/material';
import {useAuth} from "./AuthContext";
import {api} from "../api/api"
export const AuthModal = ({ isOpen, onClose, activeTab }:{isOpen:boolean,onClose:()=>void,activeTab:string}) => {
    const [tab, setTab] = useState(activeTab);
    const [loginVal, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {login}  = useAuth();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const endpoint = tab === 'login' ? window.env.BACKEND_URL+'/users/login' : window.env.BACKEND_URL+'/users/register';
            const { data } = await api.post(endpoint, { login:loginVal, password:password });
            console.log(data)
            login(data.token);
            onClose();
        } catch (err) {
            setError("Ошибка аутентификации")
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
            <Box p={3}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                    <Tab label="Вход" value="login" />
                    <Tab label="Регистрация" value="register" />
                </Tabs>

                <form onSubmit={handleSubmit}>
                    <Box mt={2}>
                        <TextField
                            fullWidth
                            label="Логин"
                            type="text"
                            value={loginVal}
                            onChange={(e) => setLogin(e.target.value)}
                            required
                        />
                    </Box>

                    <Box mt={2}>
                        <TextField
                            fullWidth
                            label="Пароль"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Box>

                    {error && <Box color="error.main" mt={2}>{error}</Box>}

                    <Box mt={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            size="large"
                        >
                            {tab === 'login' ? 'Войти' : 'Зарегистрироваться'}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Dialog>
    );
};

type AuthModalContextType = {
    openAuthModal: (type?: 'login' | 'register') => void;
    closeAuthModal: () => void;
};

const AuthModalContext = createContext<AuthModalContextType>({
    openAuthModal: () => {},
    closeAuthModal: () => {},
});

export const AuthModalProvider = ({ children }:{children:any}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

    const openAuthModal = (type: 'login' | 'register' = 'login') => {
        setActiveTab(type);
        setIsOpen(true);
    };

    const closeAuthModal = () => setIsOpen(false);

    return (
        <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
            {children}
            <AuthModal isOpen={isOpen} onClose={closeAuthModal} activeTab={activeTab} />
        </AuthModalContext.Provider>
    );
};

export const useAuthModal = () => useContext(AuthModalContext);