"use client";

import React, { useState } from "react";
import { signup } from "@/actions/signup";
import { useRouter } from "next/navigation";
import ErrorMessage from "@/components/errorMessage";
import Input from "@/components/input";
import Button from "@/components/customButton";
import Form from "@/components/form";

export default function SignupPage() {
    const [formData, setFormData] = useState({ name: "", lastName: "", email: "", password: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));
    }

    const handleSignupAction = async (data: FormData) => {
        const response = await signup(data);
        if (!response) {
            return
        }
        const json = JSON.parse(response);
        if (json?.error) {
            setErrors(json.error)
        } else if (json?.ok) {
            setMessage(json.ok.message);
            router.push("/login");
        }
    }

    return (
        <div className="flex flex-col justify-center w-full h-full">
            <Form action={handleSignupAction}>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="First name"
                    value={formData.name}
                    onChange={(e) => handleChange(e)}
                    errorMessage={errors.name}
                />
                <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => handleChange(e)}
                    errorMessage={errors.lastName}
                />
                <Input
                    id="email"
                    name="email"
                    type="text"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleChange(e)}
                    errorMessage={errors.email}
                />
                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleChange(e)}
                    errorMessage={errors.password}
                />
                {errors.message && <ErrorMessage>{errors.message}</ErrorMessage>}
                {message && <p className="text-green-600 text-center">{message}</p>}
                <Button type="submit" buttonType="signup">Sign up</Button>
            </Form>
            <p className="text-center my-4">Already have an account?</p>
            <p className="text-center italic hover:cursor-pointer" onClick={() => router.push("/login")}>Click here to sign in</p>
        </div>
    );
}