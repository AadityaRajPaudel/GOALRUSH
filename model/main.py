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
    try:

        new_model = tf.keras.models.load_model("sentimentmodel.h5")

        try:
            with open("tokenizer.json", "r") as json_file:
                tokenizer_config = json_file.read()
                tokenizer1 = tf.keras.preprocessing.text.tokenizer_from_json(
                    tokenizer_config
                )
        except FileNotFoundError:
            raise Exception("Tokenizer file not found at 'tokenizer.json'")
        except json.JSONDecodeError:
            raise Exception("Invalid JSON format in tokenizer file")

        for resource in ["stopwords", "wordnet"]:
            try:
                nltk.download(resource, quiet=True)
            except Exception as e:
                print(f"Warning: Failed to download NLTK resource {resource}: {e}")

        stop_words = set(stopwords.words("english"))
        stemmer = SnowballStemmer("english")
        lemmatizer = WordNetLemmatizer()

        def textcleaning(text, stem=False):
            text = re.sub(
                "@\S+|https?:\S+|http?:\S|[^A-Za-z0-9]+", " ", str(text).lower()
            ).strip()

            tokens = []
            for token in text.split():
                if token not in stop_words:
                    if stem:
                        token = stemmer.stem(token)
                    if lemmatizer:
                        token = lemmatizer.lemmatize(token)
                    tokens.append(token)

            return " ".join(tokens)

        def get_sentiment(prediction):
            if 0.42 <= prediction[0] <= 0.58:
                return "neutral"
            return "happy" if prediction[0] < 0.42 else "sad"

        finalResult = []
        try:
            cleaned_text = textcleaning(title)

            sequences = tokenizer1.texts_to_sequences([cleaned_text])
            padded_sequences = pad_sequences(sequences, padding="post", maxlen=50)

            predictions = new_model.predict(padded_sequences, verbose=0)
            print(predictions)
            sentiment = get_sentiment(predictions[0])

            finalResult.append(sentiment)

        except Exception as e:
            print(f"Error processing message: {e}")
            finalResult.append("error")

        return finalResult

    except Exception as e:
        print(f"Critical error in modelTest: {e}")
        return None
    # try:
    #     new_model = tf.keras.models.load_model('sentimentmodel.h5')
    #     with open('tokenizer.json') as json_file:
    #         json_string = json_file.read()

    #     tokenizer1 = tf.keras.preprocessing.text.tokenizer_from_json(json_string)
    #     tokenizer1.oov_token = '<UNK>'
    #     print("tokenizer is:",tokenizer1)

    #     nltk.download('stopwords')
    #     nltk.download('wordnet')
    #     stop_words = stopwords.words('english')
    #     stemmer = SnowballStemmer('english')
    #     lemmatizer = WordNetLemmatizer()


    #     text_cleaning_re = "@\S+|https?:\S+|http?:\S|[^A-Za-z0-9]+"

    #     def textcleaning(text, stem=False):
    #         tokens = []
    #         text = re.sub(text_cleaning_re, ' ', str(text)).strip()
            
    #         for token in text.split():
    #             if token not in stop_words:
    #                 if stem:
    #                     tokens.append(stemmer.stem(token))
    #                 if lemmatizer:
    #                     tokens.append(lemmatizer.lemmatize(token))
    #                 else:
    #                     tokens.append(token)
                        
                        
    #         return " ".join(tokens)
        
    #     text = title
    #     words_to_check = ["I", "IT","it", "you", "he", "she", "they", "we", "The", 'the', "I've", "this", "This", "i", "I'm", "It", 'it', "It's" ,"it's" , "how", "How", "Memories", "memories"]  

    #     words_in_text = text.split()


    #     filtered_words = [word for word in words_in_text if word not in words_to_check]


    #     new_text = " ".join(filtered_words)

    #     text = new_text
    #     list(text)
    #     text = textcleaning(text)
        
    #     print(text, "Text")
    #     sequences = tokenizer1.texts_to_sequences([text])
    #     print(sequences)

    #     sequences = pad_sequences(sequences, padding='post', maxlen=50)


    #     predictions = new_model.predict(sequences)

    #     predictions.tolist
        

    #     print(predictions)
    #     if (predictions[0][0] > 0.65):
    #         result = "happy"
    #     elif (predictions[0][0] < 0.55):
    #         result = "sad"
    #     else:
    #         result = "neutral"
    # except:
    #     result = "neutral"

    # return {"result": f"{result}"}
