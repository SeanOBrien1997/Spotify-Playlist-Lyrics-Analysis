import express from 'express';

const app = express();
const port: Number = 5001;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});