import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (url.pathname === "/login" || url.pathname === "/signup") {
        if (token) {
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    if (!token) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next).*)"], // Match all routes except API routes
};
