import type { Dispatch, JSX, SetStateAction } from "react";
import Login from "./Login";
import { type TokensService } from "../types/User";

type RegisterProps = {
    tokens?: TokensService,
    setTokens: Dispatch<SetStateAction<TokensService | undefined>>
}

const Register = ({ tokens, setTokens }: RegisterProps): JSX.Element => {
    return <Login initialTab="register" tokens={tokens} setTokens={setTokens} />;
};

export default Register;
