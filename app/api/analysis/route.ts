import { ok } from 'assert';
import { NextRequest, NextResponse } from 'next/server';



export async function POST(request: Request, response: Response) {
    const body = await request.json();
    const domain = body.domain;


    const fetchAnalysis = await fetch('https://www.virustotal.com/api/v3/urls', {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'x-apikey': process.env.VIRUS_TOTAL_PRIVATE_KEY || '',
        },
        body: new URLSearchParams({url: domain}),
        cache: 'no-store'
    });

    const responseFetchAnalysis = await fetchAnalysis.json();

    var is_finish = false;
    var responseFetchAnalysisUUID : any;
    while(is_finish == false){
        is_finish = true;

        const fetchAnalysisUUID = await fetch('https://www.virustotal.com/api/v3/analyses/' + responseFetchAnalysis?.data?.id, {
            method: 'GET',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'x-apikey': process.env.VIRUS_TOTAL_PRIVATE_KEY || '',
            },
            cache: 'no-store'
        });

        const responseFetchAnalysisUUIDT = await fetchAnalysisUUID.json();
        if(responseFetchAnalysisUUIDT?.data?.attributes?.status != "completed"){
            is_finish = false;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        else
            responseFetchAnalysisUUID = responseFetchAnalysisUUIDT;
    }

    return NextResponse.json(responseFetchAnalysisUUID?.data?.attributes);
}