from datetime import date
import json
import nltk
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
import pandas as pd 
import numpy as np
import string
from collections import Counter
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk.data 

# Ran on first invocation only
def function_init():
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('wordnet')
    nltk.download('vader_lexicon')

function_init()

def handler(event, context):
    sentence = event['message']
    initial_lyrics_df = pd.DataFrame({
        'lyric': [sentence]
    })
    clean_lyrics_df = clean_lyrics(initial_lyrics_df, 'lyric')
    unique_words = []
    unique_words_df = clean_lyrics_df.reset_index(drop=True)
    for word in unique_words_df['lyric'].tolist():
        unique_words.append(unique(lyrics_to_words(word).split()))
    unique_words_df['words'] = unique_words
    copy_words = []
    for word in unique_words_df['lyric'].tolist():
        copy_words.append((lyrics_to_words(word).split()))
    unique_words_df['copy_words'] = copy_words


    sid = SentimentIntensityAnalyzer()

    words_as_str = ' '.join(copy_words[0])

    scores = sid.polarity_scores(words_as_str)
    negative = scores['neg']
    neutral = scores['neu']
    positive = scores['pos']
    compound = scores['compound']
    print('Neg: {} Neu: {} Pos: {} Com: {}'.format(negative, neutral, positive, compound))

    word_count = Counter(copy_words[0])
    word_dictionary = {}
    for word,count in word_count.items():
        word_dictionary[word] = count

    print(json.dumps(word_dictionary))
    return {
        'statusCode': 200,
        'body': {
            'sentiment': {
                'negative': negative,
                'neutral': neutral,
                'positive': positive,
                'compound': compound
            },
            'frequencies': word_dictionary
        }
    }

def clean_lyrics(df,column):
    """
    This function cleans the words without importance and fix the format of the  dataframe's column lyrics 
    parameters:
    df = dataframe
    column = name of the column to clean
    """
    df = df
    df[column] = df[column].str.lower()
    df[column] = df[column].str.replace(r"verse |[1|2|3]|chorus|bridge|outro","").str.replace("[","").str.replace("]","")
    df[column] = df[column].str.lower().str.replace(r"instrumental|intro|guitar|solo","")
    df[column] = df[column].replace(r'\s+|\\n', ' ', regex=True) 
    df[column] = df[column].str.replace('[^a-zA-Z]', ' ')
    df[column] = df[column].str.strip()

    return df

def lyrics_to_words(document):
    """
    This function splits the text of lyrics to  single words, removing stopwords and doing the lemmatization to each word
    parameters:
    document: text to split to single words
    """
    stop_words = set(stopwords.words('english'))
    exclude = set(string.punctuation)
    lemma = WordNetLemmatizer()
    stopwordremoval = " ".join([i for i in document.lower().split() if i not in stop_words])
    punctuationremoval = ''.join(ch for ch in stopwordremoval if ch not in exclude)
    normalized = " ".join(lemma.lemmatize(word) for word in punctuationremoval.split())
    return normalized

def unique(list1):
    unique_list = []
    for x in list1:
        if x not in unique_list:
            unique_list.append(x)
    return unique_list

def lyrics_to_words(document):
    """
    This function splits the text of lyrics to  single words, removing stopwords and doing the lemmatization to each word
    parameters:
    document: text to split to single words
    """
    stop_words = set(stopwords.words('english'))
    exclude = set(string.punctuation)
    lemma = WordNetLemmatizer()
    stopwordremoval = " ".join([i for i in document.lower().split() if i not in stop_words])
    punctuationremoval = ''.join(ch for ch in stopwordremoval if ch not in exclude)
    normalized = " ".join(lemma.lemmatize(word) for word in punctuationremoval.split())
    return normalized