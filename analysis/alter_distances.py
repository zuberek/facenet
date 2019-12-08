from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
# from sklearn.cluster import KMeans

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import json


convs = pd.read_csv('conversations.csv', na_filter=False)

# append all messages
convs['all'] = convs.iloc[:,3:10000].apply(lambda x: ' '.join(x), axis=1)
convs = convs[['name','type','lang','all']]

vectorizer = TfidfVectorizer(stop_words='english')

convs_tfidf = vectorizer.fit_transform(convs['all']).toarray()

distances = cosine_similarity(convs_tfidf, convs_tfidf)
plt.imshow(distances[:30,:30], cmap='hot', interpolation='nearest')
plt.colorbar()
plt.show()

# compile distances into a list of graph links (source -> target, magnitude)
# for each source I check less targets cuz links work both ways
threshold = 0.5 # boundary at which the connection is deemed not strong enough
links = [] # compiled graph links
for covered_sources, source_conv in enumerate(distances):
    for i, target_conv in enumerate(source_conv[covered_sources+1:]): # +1 cuz you don't link back to source
        if (target_conv >= threshold): # skip if below
            links.append({'source':covered_sources, 'target':i+covered_sources, 
                "distance": target_conv})

path_to_friends = 'friends.json'
with open(path_to_friends) as f:
    friends = json.loads(f.read())

friends['links'] = links

with open('friends.json', 'w', newline='') as output_file:
    json.dump(friends, output_file, indent=2, default=str)


# Clustering
# true_k = 3
# model = KMeans(n_clusters=true_k, init='k-means++', max_iter=100, n_init=1)
# model.fit(convs_tfidf)
# print(model.labels_)

# order_centroids = model.cluster_centers_.argsort()[:, ::-1]
# terms = vectorizer.get_feature_names()

# for i in range(true_k):
#     print('Cluster %d:' % i),
#     for ind in order_centroids[i, :10]:
#         print(' %s' % terms[ind])