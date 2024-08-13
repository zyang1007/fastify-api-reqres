import fastify from 'fastify';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const app = fastify({ logger: true });  // create a fastify instance
const AVATAR_DIR = './avatars';

await fs.mkdir(AVATAR_DIR, { recursive: true }); // ensure the avatar directory exists.

// helper function to get the file path for a user's avatar.
const getAvatarFilePath = (userId) => path.join(AVATAR_DIR, `${userId}.jpg`);

// GET /api/user/{userId}
app.get('/api/user/:userId', async (request, reply) => {  // define route
    const { userId } = request.params;
    try {
        const response = await axios.get(`https://reqres.in/api/users/${userId}`);  // CRUD
        return response.data;
    } catch (error) {
        reply.status(error.response?.status || 500).send(error.message);
    }
});

// GET /api/user/{userId}/avatar
app.get('/api/user/:userId/avatar', async (request, reply) => {
    const { userId } = request.params;
    const avatarFilePath = getAvatarFilePath(userId);

    try {
        // check if the avatar already exists locally
        try {
            const avatarData = await fs.readFile(avatarFilePath);
            const base64Avatar = avatarData.toString('base64');
            return { base64Avatar };
        } catch (err) {
        }

        // Avatar doesn't exist locally, fetch it from the API
        const response = await axios.get(`https://reqres.in/api/users/${userId}`);
        const avatarUrl = response.data.data.avatar;
        const avatarResponse = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
        const avatarBuffer = avatarResponse.data;

        // Save the avatar to the filesystem
        await fs.writeFile(avatarFilePath, avatarBuffer);

        // Return the base64 representation of the avatar
        const base64Avatar = avatarBuffer.toString('base64');
        return { base64Avatar };
    } catch (error) {
        reply.status(error.response?.status || 500).send(error.message);
    }
});

// DELETE /api/user/{userId}/avatar
app.delete('/api/user/:userId/avatar', async (request, reply) => {
    const { userId } = request.params;
    const avatarFilePath = getAvatarFilePath(userId);

    try {
        await fs.unlink(avatarFilePath);
        return { message: `Avatar for user ${userId} deleted.` };
    } catch (err) {
        if (err.code === 'ENOENT') {
            return reply.status(404).send({ error: 'Avatar not found.' });
        }
        reply.status(500).send({ error: 'Could not delete avatar.' });
    }
});

// run the server
app.listen({ port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server is running at ${address}`);
});