# AI GD Helper Buddy - Your Personal GD Coach

### 1. Environment Configuration
## Setup Instructions
1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
2. Add your API keys to the `.env` file:
   ```env
   VITE_GEMINI_API_KEY=your-actual-gemini-api-key
   VITE_OPENAI_API_KEY=your-actual-openai-api-key (optional)
   ```
3. Never commit the `.env` file to version control (it's already in .gitignore)
### 2. Getting API Keys
#### Gemini API Key:
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file
#### OpenAI API Key (Optional):
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new secret key
3. Copy the key to your `.env` file
### 3. Installation & Running
```bash
# Install dependencies
npm install
# Start development server
npm run dev
```
### 4. Security Notes
- API keys are stored in environment variables
- Never expose API keys in client-side code
- The `.env` file is excluded from version control
- API keys are validated before use
- Auto-initialization attempts to use environment variables first
### 5. Troubleshooting
If you see "Configure Gemini API" modal:
1. Check that your `.env` file exists
2. Verify the API key format is correct
3. Restart the development server
4. Check browser console for configuration status