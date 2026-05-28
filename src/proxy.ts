import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    const url = new URL(request.url);
    const token = request.cookies.get('token')?.value;

    const isAuthPage = url.pathname.startsWith('/auth');

     const isAdminPage = url.pathname.startsWith('/dashboard');

     if (token && isAuthPage) {
        const referer = request.headers.get('referer');
        if (referer) {
            const refererUrl = new URL(referer);
            if (refererUrl.origin === url.origin) {
                return NextResponse.redirect(refererUrl);
            }
        }
        return NextResponse.redirect(new URL('/', request.url));
    }

     if (!token && isAdminPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {

    matcher : [
        '/',
        '/dashboard/:path*',
        '/auth/:path*'
    ]
}