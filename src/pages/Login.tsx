import type { FormEvent, JSX } from "react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
    Mail,
    Lock,
    User,
    Phone,
    MapPin,
    Info,
} from "lucide-react";
import "../css/auth.css";
import { useAuth } from "../hooks/useAuth";
import type { RegisterUserData } from "../types/User";

type AuthTab = "login" | "register";

type AuthMessage = {
    type: "success" | "error";
    text: string;
};

type LoginProps = {
    initialTab?: AuthTab;
};

const emptyRegisterForm = {
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    neighborhood: "",
};

const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Login = ({ initialTab = "login" }: LoginProps): JSX.Element => {
    const navigate = useNavigate();
    const { loggedUser, login, register } = useAuth();
    const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);
    const [message, setMessage] = useState<AuthMessage | null>(null);
    const [loginForm, setLoginForm] = useState({ email: "", password: "" });
    const [registerForm, setRegisterForm] = useState(emptyRegisterForm);

    if (loggedUser) {
        return <Navigate to="/" replace />;
    }

    const changeTab = (tab: AuthTab): void => {
        setActiveTab(tab);
        setMessage(null);
    };

    const updateRegisterField = (
        field: keyof typeof registerForm,
        value: string,
    ): void => {
        setRegisterForm((currentForm) => ({ ...currentForm, [field]: value }));
    };

    const validateRegisterForm = (): string | null => {
        const requiredFields = [
            registerForm.name,
            registerForm.phone,
            registerForm.email,
            registerForm.password,
            registerForm.confirmPassword,
            registerForm.address,
            registerForm.neighborhood,
        ];

        if (requiredFields.some((field) => field.trim().length === 0)) {
            return "Preencha todos os campos obrigatorios.";
        }

        if (!isValidEmail(registerForm.email)) {
            return "Informe um email valido.";
        }

        if (registerForm.password.length < 6) {
            return "A senha deve ter no minimo 6 caracteres.";
        }

        if (registerForm.password !== registerForm.confirmPassword) {
            return "Senha e confirmar senha devem ser iguais.";
        }

        return null;
    };

    const handleRegister = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        const validationError = validateRegisterForm();
        if (validationError) {
            setMessage({ type: "error", text: validationError });
            return;
        }

        const userData: RegisterUserData = {
            name: registerForm.name.trim(),
            phone: registerForm.phone.trim(),
            email: registerForm.email.trim(),
            password: registerForm.password,
            address: registerForm.address.trim(),
            neighborhood: registerForm.neighborhood.trim(),
        };

        try {
            register(userData);
            setRegisterForm(emptyRegisterForm);
            setActiveTab("login");
            setMessage({
                type: "success",
                text: "Conta criada com sucesso. Faca login para continuar.",
            });
        } catch (error) {
            setMessage({
                type: "error",
                text:
                    error instanceof Error
                        ? error.message
                        : "Nao foi possivel criar a conta.",
            });
        }
    };

    const handleLogin = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (!loginForm.email.trim() || !loginForm.password.trim()) {
            setMessage({ type: "error", text: "Informe email e senha." });
            return;
        }

        if (!isValidEmail(loginForm.email)) {
            setMessage({ type: "error", text: "Informe um email valido." });
            return;
        }

        try {
            login({
                email: loginForm.email,
                password: loginForm.password,
            });
            navigate("/", { replace: true });
        } catch (error) {
            setMessage({
                type: "error",
                text:
                    error instanceof Error
                        ? error.message
                        : "Nao foi possivel entrar.",
            });
        }
    };

    return (
        <div className="auth-page">
            <header className="auth-header">
                <div className="auth-brand">
                    <div className="auth-brand-text">
                        <h1 className="auth-brand-title">
                            <span className="brand-city">City</span>
                            <span className="brand-denuncia">Denúncia</span>
                        </h1>
                    </div>
                </div>

                <nav className="auth-nav">
                    <a href="#">Sobre</a>
                    <a href="#">Ajuda</a>
                </nav>
            </header>

            <main className="auth-main">
                <h2 className="auth-title">Bem-vindo!</h2>
                <p className="auth-subtitle">
                    Faca login ou crie sua conta para comecar
                </p>

                <section className="auth-card">
                    <div className="auth-tabs">
                        <button
                            className={`auth-tab ${
                                activeTab === "login" ? "active" : ""
                            }`}
                            onClick={() => changeTab("login")}
                            type="button"
                        >
                            Entrar
                        </button>
                        <button
                            className={`auth-tab ${
                                activeTab === "register" ? "active" : ""
                            }`}
                            onClick={() => changeTab("register")}
                            type="button"
                        >
                            Criar Conta
                        </button>
                    </div>

                    {activeTab === "login" ? (
                        <form className="auth-form" onSubmit={handleLogin}>
                            {message && (
                                <div className={`auth-message ${message.type}`}>
                                    {message.text}
                                </div>
                            )}

                            <div className="auth-field">
                                <label htmlFor="login-email">Email</label>
                                <div className="auth-input-wrapper">
                                    <span className="auth-input-icon">
                                        <Mail size={20} strokeWidth={2} />
                                    </span>
                                    <input
                                        className="auth-input"
                                        id="login-email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={loginForm.email}
                                        onChange={(event) =>
                                            setLoginForm((currentForm) => ({
                                                ...currentForm,
                                                email: event.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="login-password">Senha</label>
                                <div className="auth-input-wrapper">
                                    <span className="auth-input-icon">
                                        <Lock size={20} strokeWidth={2} />
                                    </span>
                                    <input
                                        className="auth-input"
                                        id="login-password"
                                        type="password"
                                        placeholder="Digite sua senha"
                                        value={loginForm.password}
                                        onChange={(event) =>
                                            setLoginForm((currentForm) => ({
                                                ...currentForm,
                                                password: event.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            <button className="auth-button" type="submit">
                                Entrar
                            </button>
                            <Link className="auth-forgot-link" to="/reset-password">
                                Esqueci minha senha
                            </Link>
                        </form>
                    ) : (
                        <form
                            className="auth-form auth-register-form"
                            onSubmit={handleRegister}
                        >
                            {message && (
                                <div className={`auth-message ${message.type}`}>
                                    {message.text}
                                </div>
                            )}

                            <div className="auth-info-box">
                                <div className="auth-info-title">
                                    <Info size={20} />
                                    <span>Como criar sua conta</span>
                                </div>
                                <ul>
                                    <li>Preencha todos os campos obrigatórios</li>
                                    <li>Use um email válido para verificação</li>
                                    <li>Senha deve ter no mínimo 6 caracteres</li>
                                    <li>Informe seu endereço para localizar denúncias</li>
                                </ul>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="register-name">
                                    Nome Completo *
                                </label>
                                <div className="auth-input-wrapper">
                                    <span className="auth-input-icon">
                                        <User size={20} strokeWidth={2} />
                                    </span>
                                    <input
                                        className="auth-input"
                                        id="register-name"
                                        placeholder="Digite seu nome completo"
                                        value={registerForm.name}
                                        onChange={(event) =>
                                            updateRegisterField(
                                                "name",
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="register-phone">Telefone *</label>
                                <div className="auth-input-wrapper">
                                    <span className="auth-input-icon">
                                        <Phone size={20} strokeWidth={2} />
                                    </span>
                                    <input
                                        className="auth-input"
                                        id="register-phone"
                                        placeholder="(00) 00000-0000"
                                        value={registerForm.phone}
                                        onChange={(event) =>
                                            updateRegisterField(
                                                "phone",
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="register-email">Email *</label>
                                <div className="auth-input-wrapper">
                                    <span className="auth-input-icon">
                                        <Mail size={20} strokeWidth={2} />
                                    </span>
                                    <input
                                        className="auth-input"
                                        id="register-email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={registerForm.email}
                                        onChange={(event) =>
                                            updateRegisterField(
                                                "email",
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="register-password">Senha *</label>
                                <div className="auth-input-wrapper">
                                    <span className="auth-input-icon">
                                        <Lock size={20} strokeWidth={2} />
                                    </span>
                                    <input
                                        className="auth-input"
                                        id="register-password"
                                        type="password"
                                        placeholder="Mínimo 6 caracteres"
                                        value={registerForm.password}
                                        onChange={(event) =>
                                            updateRegisterField(
                                                "password",
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="register-confirm-password">
                                    Confirmar Senha *
                                </label>
                                <div className="auth-input-wrapper">
                                    <span className="auth-input-icon">
                                        <Lock size={20} strokeWidth={2} />
                                    </span>
                                    <input
                                        className="auth-input"
                                        id="register-confirm-password"
                                        type="password"
                                        placeholder="Digite a senha novamente"
                                        value={registerForm.confirmPassword}
                                        onChange={(event) =>
                                            updateRegisterField(
                                                "confirmPassword",
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="register-address">Endereço *</label>
                                <div className="auth-input-wrapper">
                                    <span className="auth-input-icon">
                                        <MapPin size={20} strokeWidth={2} />
                                    </span>
                                    <input
                                        className="auth-input"
                                        id="register-address"
                                        placeholder="Rua, número"
                                        value={registerForm.address}
                                        onChange={(event) =>
                                            updateRegisterField(
                                                "address",
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="register-neighborhood">
                                    Bairro *
                                </label>
                                <div className="auth-input-wrapper">
                                    <span className="auth-input-icon">
                                        <MapPin size={20} strokeWidth={2} />
                                    </span>
                                    <input
                                        className="auth-input"
                                        id="register-neighborhood"
                                        placeholder="Seu bairro"
                                        value={registerForm.neighborhood}
                                        onChange={(event) =>
                                            updateRegisterField(
                                                "neighborhood",
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <button className="auth-button" type="submit">
                                Criar Conta
                            </button>
                        </form>
                    )}
                </section>
            </main>

            <footer className="auth-footer">
                <div className="auth-footer-content">
                    <span>© 2026 Denuncia Urbana - Sistema Distribuido</span>
                    <div className="auth-footer-links">
                        <a href="#sobre">Sobre o Projeto</a>
                        <a href="#documentacao">Documentacao</a>
                        <a href="#suporte">Suporte</a>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Login;
