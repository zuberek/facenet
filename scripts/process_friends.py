import os
import json
import csv
from datetime import datetime
from random import randint

friends = []
assigned_ids = 0

for inbox in os.listdir('messages/inbox'):

    sent = 0
    received = 0

    # get static data like name and start of conversation
    with open('messages/inbox/%s/message_1.json' % inbox) as f:
        conversation = json.loads(f.read())

    # skip if group conversation
    if(len(conversation['participants']) > 2):
        continue
        
    name = conversation['title']
    clean_name = name.encode('ascii', 'ignore').decode()

    # skip if non ascii name
    if(len(clean_name) < 3):
        continue
    if clean_name.strip() == "Facebook":
        continue

    name_list = conversation['title'].split() 
    initials = "" 
    for elem in name_list: 
        initials += (elem[0].upper()+'.')
    
    latest = datetime.fromtimestamp(int(str(conversation['messages'][0]['timestamp_ms'])[:-3]))
    
    years = {}

    # count exchanged messages
    for messages in os.listdir('messages/inbox/%s' % inbox):

        # skip if not json
        if messages.split('.')[-1] != 'json':
            continue

        with open('messages/inbox/%s/%s' % (inbox, messages)) as f:
            conversation = json.loads(f.read())
        oldest = datetime.fromtimestamp(int(str(conversation['messages'][-1]['timestamp_ms'])[:-3]))    

        for message in conversation['messages']:
            
            message_date = datetime.fromtimestamp(int(str(message['timestamp_ms'])[:-3]))
            
            if message_date.year in years:
                years[message_date.year] = years[message_date.year] + 1
            else:
                years[message_date.year] = 0

    # append to a total list
    friends.append({'id': assigned_ids, 'name': initials, 'relationship': randint(0, 2), 'oldest': oldest.year, 'latest': latest.year, "years": years})
    assigned_ids += 1

dictionary =  {}
dictionary['nodes'] = friends
    
with open('friends.json', 'w', newline='') as output_file:
    json.dump(dictionary, output_file, indent=2, default=str)