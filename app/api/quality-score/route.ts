import { ok } from 'assert';
import { NextRequest, NextResponse } from 'next/server';



export async function POST(request: Request, response: Response) {
    const body = await request.json();
    const domain = body.domain;

    const domainWithoutHttp = domain.replace(/^https?:\/\//, '');
    

    const fetchQuality= await fetch('https://www.ipqualityscore.com/api/json/url/'+process.env.QUALITY_SCORE_PRIVATE_KEY+'/'+domainWithoutHttp);
    const responseFetchQuality = await fetchQuality.json();
    

    //delete 
    delete responseFetchQuality.domain_trust;
    delete responseFetchQuality.technologies;
    delete responseFetchQuality.content_type;
    delete responseFetchQuality.status_code;
    delete responseFetchQuality.page_size;
    delete responseFetchQuality.domain_rank;
    delete responseFetchQuality.country_code;
    delete responseFetchQuality.hosted_content;
    delete responseFetchQuality.page_title;
    delete responseFetchQuality.language_code;
    delete responseFetchQuality.final_url;
    delete responseFetchQuality.request_id;

    return NextResponse.json(responseFetchQuality);
}