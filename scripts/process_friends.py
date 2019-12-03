import os
import json
import csv
from datetime import datetime

friends = []

for i, messages in enumerate(os.listdir('messages/inbox')):
    with open('messages/inbox/%s/message_1.json' % messages) as f:
        conversation = json.loads(f.read())

    if(len(conversation['participants']) > 2):
        continue

    name = conversation['title']
    # latest = conversation['messages'][0]['timestamp_ms']
    started = datetime.fromtimestamp(int(str(conversation['messages'][-1]['timestamp_ms'])[:-3]))
    # latest = int(str(conversation['messages'][0]['timestamp_ms'])[:-3])
    # latest = datetime.now()
    name = name.encode('ascii', 'ignore').decode()

    if(len(name) == 0):
        continue

    sent = 0
    received = 0

    for message in conversation['messages']:
        if(message['sender_name'] == name):
            received = received + 1 
        else:
            sent = sent + 1

    # interval = datetime.now() - datetime.fromtimestamp(started)
    # interval = datetime.fromtimestamp(latest) - datetime.fromtimestamp(started)
    # frequency = (sent+received)/interval.days

    # split the string into a list  
    name_list = name.split() 
    name = "" 
  
    for elem in name_list: 
        name += (elem[0].upper()+'.') 
          
    friends.append({'name': name, 'started': started, 'sent': sent,
                    'received': received})

with open('friends.csv', 'w', newline='') as output_file:
    dict_writer = csv.DictWriter(output_file, friends[0].keys())
    dict_writer.writeheader()
    dict_writer.writerows(friends)

