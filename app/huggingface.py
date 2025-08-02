from sentence_transformers import SentenceTransformer
from transformers import pipeline
import numpy as np


embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
sentiment_model = pipeline("sentiment-analysis", model="savasy/bert-base-turkish-sentiment-cased")


def embed_product(title: str, description: str, brand: str):
    """
    Create an embedding for a product and save it to the embedding column.
    
    Args:
        title (str): Product title.
        description (str): Product description.
        brand (str): Product brand.
    
    Returns:
        List: Returns the embedding of the product.
    """
    global embedding_model

    text = f"Title: {title}\nDescription: {description}\nBrand: {brand}"

    embedding = embedding_model.encode(text)
    embedding = embedding / np.linalg.norm(embedding)
    embedding = embedding.tolist()

    return embedding


def embed_text(text: str):
    global embedding_model

    embedding = embedding_model.encode(text)
    
    return embedding


def analyze_comment_sentiment(text: str):
    return sentiment_model(text)
