import { NavLink, Outlet } from "react-router-dom";
import { useState, type JSX } from "react";

const Header: React.FC = (): JSX.Element => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const accountIcon: JSX.Element = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" />
        </svg>
    );

    const queryComplaintsIcon: JSX.Element = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M360-200v-80h480v80H360Zm0-240v-80h480v80H360Zm0-240v-80h480v80H360ZM200-160q-33 0-56.5-23.5T120-240q0-33 23.5-56.5T200-320q33 0 56.5 23.5T280-240q0 33-23.5 56.5T200-160Zm0-240q-33 0-56.5-23.5T120-480q0-33 23.5-56.5T200-560q33 0 56.5 23.5T280-480q0 33-23.5 56.5T200-400Zm-56.5-263.5Q120-687 120-720t23.5-56.5Q167-800 200-800t56.5 23.5Q280-753 280-720t-23.5 56.5Q233-640 200-640t-56.5-23.5Z" />
        </svg>
    );

    const newComplaintIcon: JSX.Element = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z" />
        </svg>
    );

    return (
        <>
            <header>
                <h1>
                    <span style={{ color: "black" }}>City</span>Denúncia
                </h1>
                <nav className={isMenuOpen ? "open" : ""} id="main-navigation">
                    <ul>
                        <li>
                            <NavLink to="/criar-denuncia">
                                {newComplaintIcon}
                                Criar denúncia
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/">
                                {queryComplaintsIcon}
                                Consultar denúncias
                            </NavLink>
                        </li>
                    </ul>
                </nav>
                <div>
                    <button
                        aria-label="Configurações da conta"
                        className="accont-icon"
                    >
                        {
                            /* Ícone retirado do https://fonts.google.com/icons */
                            accountIcon
                        }
                    </button>
                    <button
                        className={`burger${isMenuOpen ? " open" : ""}`}
                        aria-label="menu"
                        aria-expanded={isMenuOpen}
                        aria-controls="main-navigation"
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </header>
            <Outlet />
        </>
    );
};
export default Header;
