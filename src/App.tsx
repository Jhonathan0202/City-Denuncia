import "./css/app.css";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import type { JSX } from "react";
import Header from "./layout/Header";

function App(): JSX.Element {
    if (matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }

    const route = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<Header />}>
                <Route index element={<Home />} />
                <Route path="criar-denuncia" element={<Home />} />
            </Route>,
        ),
    );

    return <RouterProvider router={route} />;
}

export default App;
