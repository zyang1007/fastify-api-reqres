import fastify from 'fastify';
import axios from 'axios';

const app = fastify();

app.get('/api/user/:userId', async (request, reply) => {
    const { userId } = request.params;
    try {
        const response = await axios.get(`https://reqres.in/api/users/${userId}`);
        return response.data;
    } catch (error) {
        reply.status(error.response?.status || 500).send(error.message);
    }
});

app.listen({ port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server is running at ${address}`);
});