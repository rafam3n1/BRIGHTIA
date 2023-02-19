import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

const promptMap = {
  'o que é bright?': 'Bright Cloud games é um serviço streaming de jogos com servidores no Brasil'
};

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt.toLowerCase();

    let response;
    if (promptMap[prompt]) {
      response = promptMap[prompt];
    } else {
      response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: `${prompt}`,
        temperature: 0.7,
        max_tokens: 3000,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0,
      });
      response = response.data.choices[0].text;
    }

    res.status(200).send({
      bot: response
    });

  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'Something went wrong');
  }
});

app.listen(5000, () => console.log('AI server started on http://localhost:5000'));
