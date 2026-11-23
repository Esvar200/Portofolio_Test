# Esvar Ram Kumar P — Portfolio & AI Assistant

Full-stack portfolio website powered by **FastAPI**, **Google GenAI SDK**, and vanilla **HTML/CSS/JS**, configured for seamless deployment on **Vercel**.

## Project Structure

```text
├── app.py                 # FastAPI backend (/api/chat, /api/health) + local static server
├── resume_data.json       # Structured profile knowledge base for the AI assistant
├── requirements.txt       # Python dependencies for Vercel & local development
├── vercel.json            # Routes /api/* requests to app.py; serves public/ statically
├── .env.example           # Environment variable template
├── .gitignore             # Ignores local virtualenvs, caches, and .env secrets
└── public/
    ├── index.html         # Main portfolio page
    ├── style.css          # Light/dark theme, responsive grid & vinyl turntable styles
    ├── script.js          # Theme toggle, scroll reveal, duration counter & chat client
    └── assets/            # Place profile.jpg, og-image.png, and Esvar_Resume.pdf here
```

## Local Development

1. **Create a virtual environment & install dependencies:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate   # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Add your GOOGLE_API_KEY inside .env (or export it in your shell)
   export GOOGLE_API_KEY="your_api_key"
   ```

3. **Run the server locally:**
   ```bash
   uvicorn app:app --reload
   ```
   Open `http://127.0.0.1:8000` in your browser.

## Deploying to Vercel

1. **Add your static assets** into `public/assets/`:
   - `public/assets/profile.jpg` (optional — falls back to the `"E"` monogram if omitted)
   - `public/assets/Esvar_Resume.pdf` (for the "Download resume" button)
   - `public/assets/og-image.png` (social preview card image)
   *(If you have your own custom `style.css`, replace `public/style.css` with yours.)*

2. **Push to GitHub / GitLab / Bitbucket** (or deploy via Vercel CLI):
   ```bash
   npx vercel
   ```

3. **Set Environment Variables in Vercel:**
   In your Vercel Project Dashboard go to **Settings → Environment Variables** and add:
   - `GOOGLE_API_KEY` = `<your Gemini API key>`
   - `GEMINI_MODEL` = `gemini-2.5-flash` *(optional)*

4. **Redeploy** so the environment variables take effect, then verify `https://<your-domain>.vercel.app/api/health`.
