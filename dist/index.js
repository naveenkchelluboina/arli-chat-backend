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
const router = express_1.default.Router();
// After the imports, add a simple logger
const logger = (message, data) => {
    console.log(`[${new Date().toISOString()}] ${message}`, data ? data : '');
};
router.get('/api/test', (req, res) => {
    logger('Test endpoint called');
    res.json({ message: 'The server is up and running!' });
});
router.post('/api/chat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    logger('Chat request received', { model: req.body.model });
    const { messages, model = MODEL_NAME } = req.body;
    // Validate request
    if (!messages || !Array.isArray(messages)) {
        logger('Invalid request format', req.body);
        return res.status(400).json({ error: 'Invalid messages format' });
    }
    const formattedMessages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
    }));
    logger('Formatted messages', formattedMessages);
    try {
        logger('Sending request to Arli AI');
        const response = yield axios_1.default.post('https://api.arliai.com/v1/chat/completions', {
            model: model,
            messages: formattedMessages,
            repetition_penalty: 1.1,
            temperature: 0.7,
            top_p: 0.9,
            top_k: 40,
            max_tokens: 1024,
            stream: false
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${API_KEY}`,
            },
        });
        logger('Received response from Arli AI');
        if (!((_d = (_c = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.choices) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content)) {
            logger('Invalid response structure', response.data);
            throw new Error('Invalid response from Arli AI');
        }
        const reply = response.data.choices[0].message.content;
        logger('Sending successful response', { model, replyLength: reply.length });
        res.json({
            reply,
            model: model
        });
    }
    catch (error) {
        logger('Error in chat request', {
            error: error.message,
            details: (_e = error.response) === null || _e === void 0 ? void 0 : _e.data
        });
        console.error('Arli AI Error:', ((_f = error.response) === null || _f === void 0 ? void 0 : _f.data) || error.message);
        res.status(500).json({
            error: 'Error communicating with Arli AI',
            details: ((_g = error.response) === null || _g === void 0 ? void 0 : _g.data) || error.message
        });
    }
}));
app.use(router);
app.listen(PORT, () => {
    logger(`Server started`, {
        port: PORT,
        environment: process.env.NODE_ENV || 'development'
    });
});
