import express from 'express';
import axios from 'axios'

const LAMBDA_BASE_URL: string = 'http://lambda-nltk'
const LAMBDA_PORT: number = 8080
const LAMBDA_ENDPOINT: string = '2015-03-31/functions/function/invocations'
const LAMBDA_URL: string = `${LAMBDA_BASE_URL}:${LAMBDA_PORT}/${LAMBDA_ENDPOINT}`
const app = express();
const port: Number = 5001;


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    const data: string = 'Hello world from node';
    lambdaRequest(data);
});

const lambdaRequest = (msg: string) => {
    console.log('Sending request to: ' + LAMBDA_URL);
    axios.post(LAMBDA_URL, {
        message: msg
    }).then(res => {
        console.log(res.status);
        console.log(res);
    }).catch(error => {
        console.error(error);
    })
}