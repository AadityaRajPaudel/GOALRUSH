from fastapi import FastAPI
import tensorflow as tf
import json
import numpy as np
import nltk
from nltk.corpus import stopwords
from nltk.stem import SnowballStemmer
import re
import pandas as pd
from nltk.stem import WordNetLemmatizer

from tensorflow.keras.preprocessing.sequence import pad_sequences
import os
from tensorflow.keras.preprocessing.text import Tokenizer

app = FastAPI()

@app.get("/title/{title}")
def read_item(title: str):
    new_model = tf.keras.models.load_model('sentimentmodel.h5')
    with open('tokenizer.json') as json_file:
        json_string = json_file.read()

    tokenizer1 = tf.keras.preprocessing.text.tokenizer_from_json(json_string)
    tokenizer1.oov_token = '<UNK>'
    print("tokenizer is:",tokenizer1)

    nltk.download('stopwords')
    nltk.download('wordnet')
    stop_words = stopwords.words('english')
    stemmer = SnowballStemmer('english')
    lemmatizer = WordNetLemmatizer()


    text_cleaning_re = "@\S+|https?:\S+|http?:\S|[^A-Za-z0-9]+"

    def textcleaning(text, stem=False):
        tokens = []
        text = re.sub(text_cleaning_re, ' ', str(text)).strip()
        
        for token in text.split():
            if token not in stop_words:
                if stem:
                    tokens.append(stemmer.stem(token))
                if lemmatizer:
                    tokens.append(lemmatizer.lemmatize(token))
                else:
                    tokens.append(token)
                    
                    
        return " ".join(tokens)
    
    text = title
    words_to_check = ["I", "IT","it", "you", "he", "she", "they", "we", "The", 'the', "I've", "this", "This", "i", "I'm", "It", 'it', "It's" ,"it's" , "how", "How", "Memories", "memories"]  

    words_in_text = text.split()


    filtered_words = [word for word in words_in_text if word not in words_to_check]


    new_text = " ".join(filtered_words)

    print(new_text, "this first")

    text = new_text
    list(text)
    text = textcleaning(text)
    print(text, "then this")
    
    
    sequences = tokenizer1.texts_to_sequences([text])
    print(sequences)

    sequences = pad_sequences(sequences, padding='post', maxlen=50)


    predictions = new_model.predict(sequences)

    print(predictions)
    predictions.tolist

    result = ""
    if (predictions[0][0] > 0.45 and predictions[0][0] < 0.55):
        result = "calm"
    else:
        index = np.argmax(predictions)
        if (index == 0):
            result = "sad"
        else:
            result = "happy"

    return {"result": result}