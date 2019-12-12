import pandas 
import numpy as np
import string
import re

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import tensorflow_datasets as tfds

def process_message(text):
    lowers = text.lower()
    # remove the punctuation using the character deletion step of translate
    no_punctuation = lowers.translate(None, string.punctuation)
    # remove links
    no_links = re.sub(r'http\S+', '', no_punctuation)
    # remove multiple spaces
    re.sub("\s\s+", " ", no_links)

    return no_punctuation