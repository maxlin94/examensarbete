import NextAuth, { Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/util/prisma";
import { ZodError, ZodIssue } from "zod";
import loginSchema from "@/schemas/login";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            image: string;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
    }
}

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    loginSchema.parse(credentials);
                } catch (error) {
                    if (error instanceof ZodError) {
                        const errorMap = new Map<string, string>(
                            error.errors.map((issue: ZodIssue) => [
                                issue.path.join("."),
                                issue.message,
                            ])
                        );
                        throw new Error(JSON.stringify(Object.fromEntries(errorMap)));
                    } else {
                        console.log("An unexpected error occured", error);
                    }
                }

                if (!credentials) {
                    throw new Error(JSON.stringify({ error: "Invalid credentials" }));
                }
                const { email, password } = credentials;

                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user) {
                    throw new Error(JSON.stringify({ error: "Invalid credentials" }));
                }

                const isValidPassword = await bcrypt.compare(password, user.password);

                if (!isValidPassword) {
                    throw new Error(JSON.stringify({ error: "Invalid credentials" }));
                }
                return { id: user.id, name: user.name, email: user.email };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT; user: User }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },

        async session({ session, token }: { session: Session; token: JWT }) {
            if (session && session.user) {
                session.user.id = token.id;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
