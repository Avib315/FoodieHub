
// Updated ProtectedPage component
import LoadingPage from "../page/LoadingPage/index";
import NotFoundPage from "../page/NotFoundPage";
import NavBar from "../component/NavBar";
import { useHydration } from "./useHydration";
import useAdminAuth from '../store/useAdminAuth';
import { useEffect } from "react";

export default function ProtectedAdminPage({ element }) {
    const allowedPaths = [
        "/admin-panel",
        "/admin-recipe-panel",
        "/admin-users-panel",
        "/loading"
    ];

    const { adminAuth } = useAdminAuth();
    const isHydrated = useHydration();
    useEffect(()=>{
        console.log("adminAuth",adminAuth);
        
    },[])

    if (!isHydrated) {
        return <LoadingPage />;
    }

    return (
        <>
            {adminAuth ? (
                <>
                    {element}
                </>
            ) : (
                <NotFoundPage type={1} />
            )}
        </>
    );
}