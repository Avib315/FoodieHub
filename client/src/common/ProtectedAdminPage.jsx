
// Updated ProtectedPage component
import LoadingPage from "../page/LoadingPage/index";
import NotFoundPage from "../page/NotFoundPage";
import NavBar from "../component/NavBar";
import { useHydration } from "./useHydration";
import useAdminAuth from '../store/useAdminAuth';

export default function ProtectedAdminPage({ element }) {
    const { auth } = useAdminAuth();
    const isHydrated = useHydration();


    if (!isHydrated) {
        return <LoadingPage />;
    }

    return (
        <>
            {auth ? (
                <>
                    {element}
                    <NavBar />
                </>
            ) : (
                <NotFoundPage type={1} />
            )}
        </>
    );
}