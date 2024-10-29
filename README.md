# StockTrade
A virtual trading platform powered with AI to help you with the best investment strategies

![image](https://github.com/user-attachments/assets/1cfdf04c-ceb2-4834-be3d-d28a912b32d9)

## How to setup on your local
In order to run the code on your own, first clone this repo. Then setup a PostgreSQL server on your own (local, cloud provider, etc.), I recommend trying out [Neon](https://neon.tech/), a severless PostgreSQL.

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

## Source code structure
- The `ai/` folder was used for research purpose. Please check out the Jupyter notebook files to see the model performance evaluation.
- The `backend/` folder contain the backend code relating to Restful API server, implemented using [FastAPI](https://fastapi.tiangolo.com/), hosted with [fly.io](https://fly.io/), severless PostgreSQL with [Neon](https://neon.tech/).
- The `frontend/` folder is responsible for the UI of the website, built with [Next.js](https://nextjs.org/), [TailwindCSS](https://tailwindcss.com/), and [shadcn/ui](https://ui.shadcn.com/). The backbone behind char components are [Rechart](https://recharts.org/)

## Author
- [Tien Trinh](https://github.com/tientrinh21)
