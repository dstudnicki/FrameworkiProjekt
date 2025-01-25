import React, { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

const LoginContainer = styled.div`
  max-width: 27rem;
  margin: 100px auto;
  padding: 1.5rem;
  border: 1px solid;
  border-radius: 1rem;
  border-color: #E1E0E9;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
`;

const LoginSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputContainer = styled.div`
  display: grid;
  gap: 0.35rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  display: flex;
  height: 2.5rem;
  border: 1px solid #E1E0E9;
  border-radius: 0.375rem;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  padding: 0 0.5rem;
`;

const Button = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 1.25rem;
  font-size: medium;
  width: 100%;
  background-color: #1D1C24;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
`;

const RegisterContent = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`;

const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            // After login, navigate to a different page to force component remount
            navigate("/posts", { replace: true }); // Navigate to posts or any other page
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <LoginContainer>
            <LoginSection>
                <h1>Login</h1>
                <p>Enter your email below to login to your account</p>
            </LoginSection>
            <Form onSubmit={handleSubmit}>
                <InputContainer>
                    <Label>Email</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
                </InputContainer>
                <InputContainer>
                    <Label>Password</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </InputContainer>
                <Button type="submit">Login</Button>
                <RegisterContent>
                    Don't have an account?
                    <Link to="/register">Sign up</Link>
                </RegisterContent>
            </Form>
        </LoginContainer>
    );
};

export default Login;
