import { useEffect, useState } from "react";
import LoadingPage from "../page/LoadingPage/index";
import NotFoundPage from "../page/NotFoundPage";
import NavBar from "../component/NavBar";
import useAuth from "../store/useAuth";

export default function ProtectedPage({ element }) {
    const [loading, setLoading] = useState(true);
    const { auth } = useAuth()
    useEffect(() => {
        console.log('Auth changed to:', auth);
        if (auth || auth ===false) {
            setLoading(false)
        }
    }, [auth])

if(loading) return <LoadingPage />

    return (
        <>
            { auth ? <>  {element} <NavBar /> </> : <NotFoundPage type={1} /> }

        </>)
}