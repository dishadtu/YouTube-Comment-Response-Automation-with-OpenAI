// index.js (or main.js)

const { createConnection, readComments, insertComments, updateCommentResponse } = require('./database');
const { getShouldReply } = require('./openai');
const { getYoutubeComments } = require('./youtube');

async function main() {
    let connection;
    try {
        // Connect to the database
        connection = await createConnection();

        // Fetch YouTube comments for a specific video
        let comments = await getYoutubeComments('enter-video-id'); // Pass videoId of the YouTube video
        let commentData = comments.slice(0, 8).map(comment => [
            comment.id,
            comment.snippet.topLevelComment.snippet.authorDisplayName,
            comment.snippet.topLevelComment.snippet.textOriginal,
            "",  // Empty field for GPT response
            0,    // Flag (0 for not flagged)
            0     // Respond (0 for not replied)
        ]);

        // Insert the comments into the database
        await insertComments(connection, commentData);

        // Read the comments from the database
        const dbComments = await readComments(connection);

        // Process each comment and check if a reply is needed
        for (let i = 0; i < dbComments.length; i++) {
            const comment = dbComments[i];
            const commenter = comment.commenter;  // Extract commenter name
            const commentText = comment.comment; // Extract the comment text

            // Ensure the correct values are being passed to getShouldReply
            const shouldReply = await getShouldReply(commenter, commentText);

            if (shouldReply === "Yes") {
                // Update the 'respond' flag in the database if a reply is needed
                await updateCommentResponse(connection, comment.id, 1);  // 1 means "Yes, respond"
                console.log(`Updated comment ID ${comment.id} to respond.`);
            }
        }
    } catch (err) {
        console.error("Error:", err);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Call the main function
main();
