import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

export async function POST(request: NextRequest, response: NextResponse) {
    const body = await request.json();
    const content = body.content;

    try {
        const analysisResult = await analyzeContent(content);
        const resp1 = analysisResult?.choices;

        return NextResponse.json(resp1, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "An error occurred while processing the request." }, { status: 500 });
    }
}

async function analyzeContent(content: string) {
    const apiKey = process.env.AI_PRIVATE_KEY; 

    try {
        const openai = new OpenAI({
            apiKey: apiKey,
        });

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "user",
                    "content": "Analyze the text below and structure it in json as follows: short description of the content (key: description), the most important keywords in the content (key: keywords), the most important words or ideas (key: important_ideea), the sites where I could check the content (be very careful what the content is: news, description of the person, etc.) in format links (key: websites). ALL in english, returns only the json, without other details! Content: " + content
                }
            ],
            temperature: 1,
            max_tokens: 1028,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        return await response;
    } catch (error) {
        throw new Error('Failed to analyze content');
    }
}
