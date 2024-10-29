# StockTrade
A virtual trading platform powered with AI to help you with the best investment strategies

## How to setup on your local
In order to run the code on your own, first clone this repo. Then setup a PostgreSQL server on your own (local, cloud provider, etc.), I recommend trying out https://neon.tech/.

You need to run both frontend and backend to setup locally.

### Backend
1. Navigate to `backend/`
2. Create a `.env` file with as following
```env
DATABASE_URL=[YOUR_POSTRESQL_URL]

# Password hashing
SECRET_KEY=[GENERATE_YOUR_OWN_32BIT_KEY]
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```
3. Run the following command
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn  main:app --reload
```

### Frontend
1. Navigate to `frontend/`
2. Create a `.env` file with as following
```env
API_URL=http://localhost:8000
```
3. Run the following command
```
pnpm install
pnpm run dev
```
4. Now you can see the site on http://localhost:3000
