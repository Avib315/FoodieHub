
// Updated ProtectedPage component
import LoadingPage from "../page/LoadingPage/index";
import NotFoundPage from "../page/NotFoundPage";
import NavBar from "../component/NavBar";
import { useHydration } from "./useHydration";
import useAuth from '../store/useAuth';

export default function ProtectedPage({ element }) {
    const { auth } = useAuth();
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