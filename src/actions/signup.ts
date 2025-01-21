"use server";

import prisma from "@/util/prisma";
import bcrypt from "bcrypt";
import signupFormSchema from "@/schemas/signup";
import { ZodError, ZodIssue } from "zod";

export async function signup(formData: FormData) {
    try {
        const user = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            lastName: formData.get("lastName") as string,
        };

        signupFormSchema.parse(user);

        const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
        });

        if (existingUser) {
            return JSON.stringify({ error: { message: "Email already exists", status: 400 } });
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        const fullName = `${user.name} ${user.lastName}`;

        const success = await prisma.user.create({
            data: {
                name: fullName,
                email: user.email,
                password: hashedPassword,
            },
        });
        if (success) {
            return JSON.stringify({ ok: { message: "User created", status: 201 } });
        } else {
            return JSON.stringify({ error: { message: "Something went wrong", status: 500 } });
        }
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMap = new Map<string, string>(
                error.errors.map((issue: ZodIssue) => [issue.path.join("."), issue.message])
            );
            return JSON.stringify({ error: Object.fromEntries(errorMap) });
        } else {
            console.log("An unexpected error occured", error);
        }
    }
}
