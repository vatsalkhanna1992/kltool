//import OpenAI from "openai";
const OpenAI = require("openai");
const openai = new OpenAI();

const kltoolAI = async (content) => {

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a helpful assistant and your name is Kltool AI." },
            {
                role: "user",
                content: content,
            },
            {
                role: "assistant",
                content: "Hello! I'm Kltool AI. How can I assist you today? Kltool provides wide range of tools that can be used for your day to day activity. This includes Kanban board, you can your notes, you can fetch text from images and use Kltool AI as virtual assistant."
            }
        ],
    });

    return completion.choices[0].message.content;
}

module.exports = kltoolAI;