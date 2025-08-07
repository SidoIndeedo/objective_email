FROM python:3.11

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

WORKDIR /app/app  # go into the `app` folder where main.py is

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
