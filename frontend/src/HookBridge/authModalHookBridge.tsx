import { useEffect } from "react";
import { useAuthModal } from "../components/AuthModal";
import { setOpenAuthModal } from "../utils"; // путь к твоим утилям

export const AuthModalHookBridge = () => {
    const { openAuthModal } = useAuthModal();

    useEffect(() => {
        setOpenAuthModal(openAuthModal);
    }, [openAuthModal]);

    return null;
};
