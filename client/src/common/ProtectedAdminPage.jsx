// Updated ProtectedAdminPage component
import LoadingPage from "../page/LoadingPage/index";
import NotFoundPage from "../page/NotFoundPage";
import NavBar from "../component/NavBar";
import { useHydration } from "./useHydration";
import useAdminAuth from '../store/useAdminAuth';
import { useEffect } from "react";
import useAuth from "../store/useAuth";

export default function ProtectedAdminPage({ element }) {
    const allowedPaths = [
        "/admin-panel",
        "/admin-recipe-panel",
        "/admin-users-panel",
        "/loading"
    ];
      const notProtected = [
        "/admin-login",
    ]
    const { auth } = useAuth()
    const { adminAuth } = useAdminAuth();
    const isHydrated = useHydration();


    if (!isHydrated) {
        return <LoadingPage />;
    }
    if (adminAuth && notProtected.includes(location.pathname)) {  // מחובר . מנסה להגיע להתחברות
        return <NotFoundPage type={2} />;
    }
    if (!auth && !adminAuth && notProtected.includes(location.pathname)) { // לא מחובר: מנסה להגיע להתחברות
        return <>{element} </>
    }
    if (auth && !adminAuth && notProtected.includes(location.pathname)) { // לא מחובר: מנסה להגיע להתחברות
        return <NotFoundPage type={2} />;
    }

    if (auth && notProtected.includes(location.pathname)) { //יוזר שמחובר ומנסה להגיע ללוגין אדמין
        return <NotFoundPage type={2} />;
    }
    if (adminAuth && !allowedPaths.includes(location.pathname)) { // אדמין שמנסה לגשת למסלול של יוזר
        return <NotFoundPage type={2} />;
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