import os
import json
import csv
from datetime import datetime
from random import randint

friends = []

for i, inbox in enumerate(os.listdir('messages/inbox')):

    sent = 0
    received = 0

    # get static data like name and start of conversation
    with open('messages/inbox/%s/message_1.json' % inbox ) as f:
        conversation = json.loads(f.read())

    # skip if group conversation
    if(len(conversation['participants']) > 2):
        continue

    name = conversation['title']
    clean_name = name.encode('ascii', 'ignore').decode()

    # skip if non ascii name
    if(len(clean_name) == 0):
        continue

    name_list = conversation['title'].split() 
    initials = "" 
    for elem in name_list: 
        initials += (elem[0].upper()+'.') 

    started = datetime.fromtimestamp(int(str(conversation['messages'][-1]['timestamp_ms'])[:-3]))

    # count exchanged messages
    for messages in os.listdir('messages/inbox/%s' % inbox):

        # skip if not json
        if messages.split('.')[-1] != 'json':
            continue

        with open('messages/inbox/%s/%s' % (inbox, messages)) as f:
            conversation = json.loads(f.read())

        for message in conversation['messages']:
            if(message['sender_name'] == name):
                received = received + 1 
            else:
                sent = sent + 1
    
    # append to a total list
    friends.append({'id': i, 'name': initials, 'started': started, 'sent': sent,
                    'received': received, 'total': sent+received, 'relationship': randint(0, 2)})

with open('friends.csv', 'w', newline='') as output_file:
    dict_writer = csv.DictWriter(output_file, friends[0].keys())
    dict_writer.writeheader()
    dict_writer.writerows(friends)

