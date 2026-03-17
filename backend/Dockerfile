FROM python:3.12-slim

# System deps for conversions
RUN apt-get update && apt-get install -y \
    libmagic1 \
    pandoc \
    libreoffice-core libreoffice-writer libreoffice-calc libreoffice-impress \
    tesseract-ocr tesseract-ocr-ces tesseract-ocr-deu \
    poppler-utils \
    potrace \
    libheif-dev \
    libjxl-dev \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
