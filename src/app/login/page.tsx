"use client";

import {signIn} from "next-auth/react";
import React, {useState} from "react";
import Input from "@/components/input";
import Form from "@/components/form";
import {useRouter} from "next/navigation"
import Button from "@/components/customButton";
import ErrorMessage from "@/components/errorMessage";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            setErrors(JSON.parse(result.error));
        } else {
            router.push("/");
        }
    };

    return (
        <div className="flex flex-col justify-center w-full h-full">
            <Form onSubmit={handleLogin}>
                <Input
                    id="email"
                    name="email"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    errorMessage={errors.email}
                />
                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    errorMessage={errors.password}
                />
                {errors.error && <ErrorMessage>{errors.error}</ErrorMessage>}
                <Button type="submit" buttonType="signup">Login</Button>
            </Form>
            <p className="text-center my-4">No account yet?</p>
            <p className="text-center italic hover:cursor-pointer" onClick={() => router.push("/signup")}>Click here to
                sign up</p>
        </div>
    );
}