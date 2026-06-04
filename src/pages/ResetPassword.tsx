import type { JSX } from "react";
import { useState } from "react";

const ResetPassword = (): JSX.Element => {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Simulação de envio de redefinição de senha para ${email}`);
    };

    return (
        <main style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
            <h2>Redefinir senha</h2>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
                <label>
                    Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <button type="submit">Enviar link</button>
            </form>
        </main>
    );
};

export default ResetPassword;
