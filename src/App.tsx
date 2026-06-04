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
import type { JSX } from "react";
import Header from "./layout/Header";
import { Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import { useAuth } from "./hooks/useAuth";

const ProtectedRoute = (): JSX.Element => {
    const { loggedUser } = useAuth();

    if (!loggedUser) {
        return <Navigate to="/login" replace />;
    }

    return <Header />;
};

function App(): JSX.Element {
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
                    <Route path="minhas-denuncias" element={<MinhasDenuncias />} />
                    <Route path="criar-denuncia" element={<Home />} />
                    <Route path="editar-denuncia/:id" element={<EditDenuncia />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-password" element={<ResetPassword />} />
            </>
        ),
    );

    return (
        <AuthProvider>
            <RouterProvider router={route} />
        </AuthProvider>
    );
}

export default App;
