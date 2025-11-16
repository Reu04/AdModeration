import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import "./styles/styles.scss";
import "./styles/reset.css";
import AdsListPage from "./components/pages/AdsListPage";
import AdPage from "./components/pages/AdPage";
import StatsPage from "./components/pages/StatsPage";
import NotFound from "./components/pages/NotFound";

export default function App() {
    return (
        <>
            <BrowserRouter>
                <nav className="main-nav">
                    <Link to="/list">Объявления</Link>
                    <Link to="/stats">Статистика</Link>
                </nav>

                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/list" replace />}
                    />
                    <Route
                        path="/list"
                        element={<AdsListPage />}
                    />
                    <Route
                        path="/item/:id"
                        element={<AdPage />}
                    />
                    <Route
                        path="/stats"
                        element={<StatsPage />}
                    />
                    <Route
                        path="*"
                        element={<NotFound />}
                    />
                </Routes>
            </BrowserRouter>
        </>
    );
}
