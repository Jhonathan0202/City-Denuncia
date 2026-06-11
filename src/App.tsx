import "./css/app.css";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import ConsultarDenuncias from "./pages/ConsultarDenuncias";
import MinhasDenuncias from "./pages/MinhasDenuncias";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import EditDenuncia from "./pages/EditDenuncia";
import DenunciaDetails from "./pages/DenunciaDetails";
import { useState, useEffect, type JSX } from "react";
import Header from "./layout/Header";
import { Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import { useAuth } from "./hooks/useAuth";
import { type TokensService, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./types/User";

const ProtectedRoute = (): JSX.Element => {
    const { loggedUser } = useAuth();

    if (!loggedUser) {
        return <Navigate to="/login" replace />;
    }

    return <Header />;
};

function App(): JSX.Element {
    const [tokens, setTokens] = useState<TokensService | undefined>(() => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

        if (accessToken && refreshToken) {
            return { accessToken, refreshToken };
        }
        return undefined;
    });

    useEffect(() => {
        if(tokens?.accessToken) {
            localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
        } else {
            localStorage.removeItem(ACCESS_TOKEN_KEY)
        }

        if(tokens?.refreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
        } else {
            localStorage.removeItem(REFRESH_TOKEN_KEY)
        }
    }, [tokens]);

    if (matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }

    const route = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route path="/" element={<ProtectedRoute />}>
                    <Route index element={<ConsultarDenuncias />} />
                    <Route
                        path="minhas-denuncias"
                        element={<MinhasDenuncias />}
                    />
                    <Route path="criar-denuncia" element={<Home  tokens={tokens} setTokens={setTokens} />} />
                    <Route
                        path="editar-denuncia/:id"
                        element={<EditDenuncia />}
                    />
                    <Route path="denuncia/:id" element={<DenunciaDetails />} />
                </Route>

                <Route path="/login" element={<Login tokens={tokens} setTokens={setTokens} />} />
                <Route path="/register" element={<Register tokens={tokens} setTokens={setTokens} />} />
                <Route path="/reset-password" element={<ResetPassword />} />
            </>,
        ),
    );

    return (
        <AuthProvider>
            <RouterProvider router={route} />
        </AuthProvider>
    );
}

export default App;
