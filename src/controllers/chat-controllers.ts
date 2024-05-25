import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
// import { OpenAIApi, ChatCompletionRequestMessage} from "openai";
// import { configureOpenAI } from "../config/openai-config.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
export const generateChatCompletion = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { message } = req.body;
    try {
            const user = await User.findById(res.locals.jwtData.id);
            if(!user) 
                return res
                    .status(401)
                    .json({message:"User not registered OR Token malfunctioned"});
            // grab chats of user

            const chats = user.chats
            console.log("Printing chats -> ",chats)
            chats.push({ content: message, role: "user"});
            // user.chats.push({ content: message, role: "user"});

            // send all chats with new one to openAI API
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_SECRET_KEY);
            // const config = configureOpenAI();

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
            // const openai = new OpenAIApi(config);

            // get latest response
            const chatResponse = await model.generateContent(message);
            const response = chatResponse.response
            const text = response.text();
            console.log("Printing text -> ",text);
            user.chats.push({
                role: "AI",
                content: text
            });
            const userDetails = await user.save();
            console.log("Printing userDetails -> ",userDetails)
           return res.status(200).json({ chats: user.chats });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong" });
        }
};

export const sendChatsToUser = async (
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        // user token check
        const user = await User.findById(res.locals.jwtData.id);
        if(!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        console.log(user._id.toString(),res.locals.jwtData.id);
        
        if(user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        return res
        .status(200)
        .json({message: "OK", chats: user.chats });

    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"ERROR", cause: error.message});
    }
};

export const deleteChats = async (
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        // user token check
        const user = await User.findById(res.locals.jwtData.id);
        if(!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        // console.log(user._id.toString(),res.locals.jwtData.id);
        
        if(user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        //@ts-ignore
        user.chats = [];
        await user.save();
        return res.status(200).json({ message: "OK" });

    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"ERROR", cause: error.message});
    }
};