const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: 'enter-openai-api-key'
});

async function getShouldReply(commenter, comment) {
    // Directly use commenter and comment from the arguments, no need for comments[0] or comments[i]
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        stop: ["\n", "User:", "Comment:", "Should Reply:"],
        max_tokens: 7,
        temperature: 0,
        messages: [{
            role: "system",
            content: "you are a helpful assistant"
        },
        {
            role: "user",
            content: `The following AI tool helps youtubers identify if a comment should be replied to or not. Questions or asking for advice are good examples of when a reply is needed.\n\n` +

                // Context Example 1
                `User: John Smith\n` +
                `Comment: That was a great video, thanks!\n` +
                `Should Reply: No\n\n` +

                // Context Example 2
                `User: Sue Mary\n` +
                `Comment: I'm stuck on step four, how do I do it?` +
                `Should Reply: Yes\n\n` +

                // Context Example 3
                `User: @Ronel Gonzy\n` +
                `Comment: Can you create another video using llama?` +
                `Should Reply: Yes\n\n` +

                // Use the actual comment passed in the arguments
                `User: ${commenter}\n` +
                `Comment: ${comment}\n` +
                `Should Reply:`
        }],
    });

    const responseText = response.choices[0]?.message?.content?.trim();
    return responseText;
}

module.exports = { getShouldReply };
