import os
from dotenv import load_dotenv
from app.schemas.products import ProductBase
import google.generativeai as genai
from typing import List

dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path)

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-pro")


def generate_product_description(product: ProductBase) -> str:
    global model

    prompt = f"""
    Write a compelling product description IN TURKISH LANGUAGE for the following product:

    Title: {product.title}
    Thumbnail: {product.thumbnail}
    Brand: {product.brand}
    Price: ${product.price}
    Discount: {product.discount_percentage}%
    Rating: {product.rating}/5
    Stock: {product.stock} units available
    Category: {product.category.name}

    Use persuasive, SEO-friendly language. 
    Highlight benefits and features. 
    Keep it under 100 words. 
    Do not use a title or description introductory sentence.
    """
    response = model.generate_content(prompt)
    return response.text.strip()


def refine_query(user_input):
    global model

    prompt = f"""
    You are an AI assistant helping refine user queries in an e-commerce website.
    User queries: "{user_input}"
    Refine the query, don't be creative, just refine what the user intended to search.
    Only return the expected refined query.
    """
    response = model.generate_content(prompt)
    return response.text.strip()


def chunk_comments(comments: List[str], chunk_size: int = 50) -> List[List[str]]:
    return [comments[i:i + chunk_size] for i in range(0, len(comments), chunk_size)]


def summarize_chunk(comments_chunk: List[str]) -> str:
    global model

    reviews_text = "\n".join(f"- {c}" for c in comments_chunk)
    prompt = f"""
        You are an AI assistant helping summarize product reviews.
        Only return the expected output.
        Summarize the following customer reviews in three parts:
        1. Most appreciated features
        2. Most common complaints

        Reviews:
        {reviews_text}
        """
    response = model.generate_content(prompt)
    return response.text


def merge_summaries(summaries: List[str]) -> str:
    global model

    summaries_text = "\n\n".join(summaries)
    prompt = f"""
        You are an AI assistant.
        Only return the expected output.
        Combine the following review summaries into a single, unified final summary with:
        - Top liked features
        - Top complaints

        Summaries:
        {summaries_text}
        """
    response = model.generate_content(prompt)
    return response.text


def generate_comment_summary(all_comments: List[str]) -> str:
    chunks = chunk_comments(all_comments, chunk_size=50)
    print(f"Total chunks to process: {len(chunks)}")

    chunk_summaries = [summarize_chunk(chunk) for chunk in chunks]
    final_summary = merge_summaries(chunk_summaries)
    return final_summary
