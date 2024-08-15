//import OpenAI from "openai";
const OpenAI = require("openai");
const openai = new OpenAI();

const kltoolAI = async (content) => {

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
        //   { role: "system", content: "You are a helpful assistant." },
            {
                role: "user",
                //content: "Write a haiku about recursion in programming.",
                content: content,
            },
        ],
    });

    return completion.choices[0].message.content;
}

module.exports = kltoolAI;