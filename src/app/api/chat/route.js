import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req,res){
    try{
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({model:"gemini-1.5-flash"});
        const data = await req.json() 

        const prompt = data.body
        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }


        const results = await model.generateContent(prompt);
        const responce = results.response
        const output = await responce.text();
        return NextResponse.json({output:output})
    }
    catch(error){
        return NextResponse.json({message:"responce is not okay"})
    }
}
