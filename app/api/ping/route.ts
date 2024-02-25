import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: Request, response: Response) {
    const body = await request.json();
    var domain = body.domain;

    try {
        const result = await fetch(domain, { method: 'GET' });
        if (result.ok) {
            return NextResponse.json({ status: 'up' }, {status: 200});
        } else {
            return NextResponse.json({ status: 'down' }, {status: 404});
        }
    } catch (error) {
        return NextResponse.json({ status: 'down' }, {status: 404});
    }
}