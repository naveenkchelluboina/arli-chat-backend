"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001; // Allow dynamic port if needed (e.g., in production)
app.use((0, cors_1.default)({
    origin: '*', // Allow all origins for testing (update this in production)
}));
app.use(body_parser_1.default.json());
const API_KEY = process.env.API_KEY;
const MODEL_NAME = 'Meta-Llama-3.1-8B-Instruct';
app.get('/api/test', (req, res) => {
    res.json({ message: 'The server is up and running!' });
});
app.post('/api/chat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messages } = req.body;
    const formattedMessages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
    }));
    try {
        const response = yield axios_1.default.post('https://api.arliai.com/v1/chat/completions', {
            model: MODEL_NAME,
            messages: formattedMessages,
            temperature: 0.7,
            max_tokens: 150,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${API_KEY}`,
            },
        });
        res.json({ reply: response.data.choices[0].message.content });
    }
    catch (error) {
        //console.error(error.response?.data || error.message);
        res.status(500).send('Error communicating with Arli AI');
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
