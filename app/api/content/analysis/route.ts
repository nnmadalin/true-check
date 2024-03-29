import { NextRequest, NextResponse } from 'next/server';
const {VertexAI} = require('@google-cloud/vertexai');
const vertex_ai = new VertexAI({project: 'trans-grid-415511', location: 'europe-west3'});
const model = 'gemini-1.0-pro-vision-001'

const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generation_config: {
    "max_output_tokens": 2048,
    "temperature": 0.4,
    "top_p": 1,
    "top_k": 32
},
});

async function generateContent(content:any) {
    const req = {
      contents: [{role: 'user', parts: [{text: "It parses the content provided below and generates a json (Try to make the json complete!) (format, without starting with ```json and ending with ```, without the explanations in brackets: description (a brief description of the content provided), keywords, main_ideas (the main ideas of the content ).), websites (relevant sites for the respective content), translate all the text in English!\n\n Contents:" + content}]}],
    };
  
    const streamingResp = await generativeModel.generateContentStream(req);
  
    const response =  await streamingResp.response;
    return  response;
  };

export async function POST(request: NextRequest, response: NextResponse) {
    const body = await request.json();
    const content = body.content;

    try {
        const analysisResult = await generateContent(content)

        return NextResponse.json(analysisResult, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "An error occurred while processing the request." }, { status: 500 });
    }
}
