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
      contents: [{role: 'user', parts: [{text: "Would you like to generate an answer in JSON format (Try to make the json complete!) (the form is (without starting with ```json and ending with ```): is_fake, reason, recommendation; is_fake be true, false, or partial, all value be with a capital letter, reason and recommendation to be a vector with recommendations and reasons), translate all the text in English\n\nContent:" + content}]}],
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
