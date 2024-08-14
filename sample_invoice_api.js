import fastify from 'fastify';
import axios from 'axios';

const app = fastify({ logger: true });

const FORGING_BLOCK_API_URL = 'https://api.forgingblock.io/invoice/status';
// const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price';  // endpoint

app.post('/status/invoice', async (request, reply) => {
    const { invoice } = request.body;

    // Log the request body for debugging
    app.log.info(`Received request body: ${JSON.stringify(request.body)}`);

    if (!invoice) {
        return reply.status(400).send({ error: 'Invoice parameter is required.' });
    }

    try {
        const response = await axios.get(FORGING_BLOCK_API_URL, {
            params: {
                invoiceId: invoice,
                paymentMethodId: 'BTC',
                _: 1575903768088  // for this task and test
            }
        });

        if (response.data && response.data.btcAddress) {
            const { btcAddress, status, orderAmount, orderAmountFiat } = response.data;
            return { btcAddress, status, orderAmount, orderAmountFiat };
        } else {
            return reply.status(404).send({ error: 'Invoice ID does not correspond to a valid invoice.' });
        }
    } catch (error) {
        app.log.error(`Error: ${error.message}`);
        reply.status(error.response?.status || 500).send({ error: error.message });
    }
});

app.post('/status/eth/invoice', async (request, reply) => {
    const { invoice } = request.body;

    if (!invoice) {
        return reply.status(400).send({ error: 'Invoice parameter is required.' });
    }
    app.log.info(`Received request body: ${JSON.stringify(request.body)}`);

    try {
        // get the orderAmountFiat from the ForgingBlock API
        const response = await axios.get(FORGING_BLOCK_API_URL, {
            params: {
                invoiceId: invoice,
                paymentMethodId: 'BTC',
                _: 1575903768088  // for this task and test
            }
        });
        const invoiceData = response.data;
        if (invoiceData.error) {
            return reply.status(400).send({ error: 'Invoice ID does not correspond to a valid invoice.' });
        }

        // fetch Ethereum rate
        const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';
        const rateResponse = await axios.get(COINGECKO_API_URL);
        const rateData = rateResponse.data;

        if (!rateData.ethereum || !rateData.ethereum.usd) {
            throw new Error('Failed to fetch Ethereum rate.');
        }

        const ethereumRate = rateData.ethereum.usd;
        const orderAmountFiat = invoiceData.orderAmountFiat;
        const amountInEth = orderAmountFiat / ethereumRate;

        return { rate: ethereumRate, amountInEth };
    } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: error.message });
    }

    //     if (response.data && response.data.data) {
    //         const { orderAmountFiat } = response.data.data;
    //
    //         // get the Ethereum rate from CoinGecko API
    //         const ethResponse = await axios.get(COINGECKO_API_URL, {
    //             params: {
    //                 ids: 'ethereum',
    //                 vs_currencies: 'usd'
    //             }
    //         });
    //
    //         const ethRate = ethResponse.data.ethereum.usd;
    //         const ethAmount = orderAmountFiat / ethRate;
    //
    //         return {
    //             ethRate,
    //             ethAmount,
    //             orderAmountFiat
    //         };
    //     } else {
    //         return reply.status(404).send({ error: 'Invoice ID does not correspond to a valid invoice.' });
    //     }
    // } catch (error) {
    //     console.error(error);
    //     return reply.status(500).send({ error: 'Failed to fetch Ethereum rate.' });
    // }
});

// run the server
app.listen({ port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server is running at ${address}`);
});