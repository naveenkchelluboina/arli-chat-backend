# Arli AI Chat Backend

A Node.js/Express backend service that integrates with Arli AI's chat completion API. This service provides a RESTful API for chat interactions with Arli AI's language models.

## Features

- Express.js REST API
- TypeScript implementation
- Arli AI integration
- CORS enabled
- Environment configuration
- Detailed logging
- Error handling

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Arli AI API key

## Setup

1. Clone the repository:
bash
git clone <repository-url>
cd arli-ai-chat-backend
2. Install dependencies:
bash
npm install
3. Create a `.env` file in the root directory:
env
API_KEY=your_arli_ai_api_key
PORT=5001
MODEL_NAME=Meta-Llama-3.1-8B-Instruct
:
bash
npm run dev
### Test Connection

To test the connection to the server, you can use the following curl command:

bash
curl -X GET http://localhost:5001/api/test
http
GET /api/test
json
{
"message": "The server is up and running!"
}


## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| API_KEY | Your Arli AI API key | Required |
| PORT | Server port number | 5001 |
| MODEL_NAME | Default AI model | Meta-Llama-3.1-8B-Instruct |

## Development

The project uses TypeScript and includes the following npm scripts:

bash
Start development server with hot reload
npm run dev
Build the project
npm run build
Start production server
npm start

## Resources

- [Arli AI Documentation](https://www.arliai.com/quick-start#)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)