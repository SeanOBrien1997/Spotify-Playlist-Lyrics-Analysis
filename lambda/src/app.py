import json
import nltk

# Ran on first invocation only
def function_init():
    nltk.download('punkt')

function_init()

def handler(event, context):
    sentence = event['message']
    tokens = nltk.word_tokenize(sentence)
    token_list = list(tokens)
    print(token_list)
    return {
        'statusCode': 200,
        'body': json.dumps('Found a total of {} tokens for given message: {}'.format(len(token_list), sentence))
    }
