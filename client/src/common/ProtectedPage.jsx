import { useEffect, useState } from "react";
import { isAuthenticated } from "../services/AuthRequest";
import LoadingPage from "../page/LoadingPage/index";
import NotFoundPage from "../page/NotFoundPage";
import NavBar from "../component/NavBar";

export default function ProtectedPage({ element }) {
    const [isAuth, setIsAuth] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const checkAuth = async () => {
            const authStatus = await isAuthenticated();
            setLoading(false);
            setIsAuth(authStatus);
        }
        checkAuth();
    }, []);

    return (
        <>
            {!loading ?
                (isAuth ?
                    <>  {element} <NavBar /> </>
                    : <NotFoundPage type={1}/>) : <LoadingPage/>}

        </>)
}