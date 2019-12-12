import os
import pandas as pd
import numpy as np
import string
import re

import gensim

path_to_friends = 'data/Parry-friends.json'
path_to_inboxes = 'inboxes/'

# owner = person whose data is analyzed
# inbox - all the conversations of the owner
# conversations - messages between the owner and some person. It's like a doc
# message - singular message

# preprocess
def process_conversation(row):
    print(row)
    tokens = gensim.utils.simple_preprocess(row['all'])

    # For training data, add tags
    return gensim.models.doc2vec.TaggedDocument(tokens, [row.index()])
    # lowers = text.lower()
    # # remove the punctuation using the character deletion step of translate
    # no_punctuation = lowers.translate(None, string.punctuation)
    # # remove links
    # no_links = re.sub(r'http\S+', '', no_punctuation)
    # # remove multiple spaces
    # clean = re.sub("\s\s+", " ", no_links)

    # return clean

all_inboxes = []
for inbox_name in os.listdir('inboxes'):
    inbox = pd.read_csv(path_to_inboxes + '%s' % inbox_name, na_filter=False)

    # filter non english conversations and save mappings
    inbox = inbox[inbox['lang'] == 'eng']

    # merge columns for each message into one
    inbox['all'] = inbox.iloc[:,3:10000].apply(lambda x: ' '.join(x), axis=1)
    inbox = inbox[['type','all']]
    all_inboxes.append(inbox.apply(process_conversation))



inboxes_names = []
inboxes_mappings = {}
for inbox_name in os.listdir('inboxes'):
    inboxes_names.append(inbox_name)
    inbox = pd.read_csv(path_to_inboxes + '%s' % inbox_name, na_filter=False)

    # filter non english conversations and save mappings
    mapping = inbox['lang'] == 'eng'
    inboxes_mappings[inbox_name] = mapping
    inbox = inbox[mapping]

    # merge columns for each message into one
    inbox['all'] = inbox.iloc[:,3:10000].apply(lambda x: ' '.join(x), axis=1)
    inbox = inbox[['all','type']]

    inbox['all'] = inbox['all'].apply(process_conversation, axis=1)