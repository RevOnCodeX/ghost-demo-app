from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import time
from collections import Counter
import textstat
import nltk

nltk.download('punkt_tab', quiet=True)
nltk.download('averaged_perceptron_tagger_eng', quiet=True)

def get_nltk_metrics(text):
    words = nltk.word_tokenize(text)
    # 1. TTR & Hapax
    words_lower = [w.lower() for w in words if w.isalpha()]
    word_count = len(words_lower)
    counts = Counter(words_lower)
    unique_words = len(counts)
    ttr = unique_words / word_count if word_count > 0 else 0
    hapax = sum(1 for w, c in counts.items() if c == 1)
    
    # 2. POS Ratio
    tagged = nltk.pos_tag(words)
    adjs = sum(1 for w, t in tagged if t.startswith('JJ'))
    nouns = sum(1 for w, t in tagged if t.startswith('NN'))
    adj_noun_ratio = adjs / nouns if nouns > 0 else adjs

    # 3. Proxy for Tree Depth (using sentence complexity)
    sentences = nltk.sent_tokenize(text)
    avg_sentence_len = word_count / len(sentences) if sentences else 0
    avg_depth = (avg_sentence_len * 0.4) + (adj_noun_ratio * 2) # Mock dependency tree depth proxy
    
    return ttr, hapax, adj_noun_ratio, avg_depth

app = FastAPI(title="Ghost in the Machine API")

# Enable CORS for local React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"status": "Ghost in the Machine Backend API is running."}

# Task 1: Text Analysis (Mocking exact statistical computations for now to ensure UI works)
@app.post("/analyze")
def analyze_text(request: TextRequest):
    text = request.text
    if not text.strip():
        raise HTTPException(status_code=400, detail="Empty text")
    
    ttr, hapax, adj_noun_ratio, avg_depth = get_nltk_metrics(text)
    
    # 4. Textstat Flesch Kincaid
    fk_grade = textstat.flesch_kincaid_grade(text)
    
    # Punctuation density & Heatmap
    punct_count = sum(1 for char in text if char in ";—!,.-?")
    word_count_rough = len(text.split())
    punct_density = punct_count / word_count_rough if word_count_rough > 0 else 0
    
    heatmap = []
    for i, char in enumerate(text):
        if char == ';':
            heatmap.append({"index": i, "char": ";", "type": "semicolon"})
        elif char in ['—', '-']:
            heatmap.append({"index": i, "char": char, "type": "dash"})
        elif char == '!':
            heatmap.append({"index": i, "char": "!", "type": "exclamation"})

    return {
        "metrics": {
            "ttr": round(ttr, 4),
            "flesch_kincaid": round(fk_grade, 2),
            "punctuation_density": round(punct_density, 3),
            "hapax_legomena": hapax,
            "adj_noun_ratio": round(adj_noun_ratio, 2),
            "avg_tree_depth": round(avg_depth, 2)
        },
        "heatmap": heatmap
    }

# Task 2: Tri-Model Detection (Mocking inference for speed in initial demo build)
@app.post("/detect")
def detect_text(request: TextRequest):
    time.sleep(0.5) # simulate latency
    return {
        "predictions": {
            "tier_a": {"model": "Random Forest", "human_confidence": round(random.uniform(0.1, 0.9), 2)},
            "tier_b": {"model": "FastText NN", "human_confidence": round(random.uniform(0.05, 0.95), 2)},
            "tier_c": {"model": "RoBERTa + LoRA", "human_confidence": round(random.uniform(0.01, 0.99), 2)},
        }
    }

# Task 3: Saliency Map
@app.post("/saliency")
def get_saliency(request: TextRequest):
    words = request.text.split()
    # Mocking Captum gradients: assigning random weights for demonstration
    tokens = [{"word": w, "score": round(random.uniform(-1, 1), 2)} for w in words]
    return {"tokens": tokens, "dominant_feature": "Sentence length uniformity"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
