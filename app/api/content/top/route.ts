import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: Request, response: Response) {
    const body = await request.json();
    const content = body.content;

    try {
        const result = await fetch(`https://customsearch.googleapis.com/customsearch/v1?cx=c428b09205bd140eb&siteSearchFilter=e&safe=safeUndefined&siteSearchFilter=siteSearchFilterUndefined&key=${process.env.GOOGLE_SEARCH_PRIVATE_KEY}&q=${encodeURI(content)}`, { method: 'GET' });
        
        const resposeJson = await result.json();

        const sliceJson = resposeJson.items.slice(0, 10);


        return NextResponse.json(sliceJson, {status: 200});

    } catch (error) {
        return NextResponse.json({ status: error }, {status: 403});
    }
}