import os
import json
import csv

COLUMNS = ['name', 'type', 'lang']
MESSAGE_LIMIT = 5000

max_message_count = 0
all_conversations = []

for i, inbox in enumerate(os.listdir('messages/inbox')):

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

    conv_arr = [clean_name, 'collegue', 'eng']

    # aggregate exchanged messages
    count = 0
    for messages in os.listdir('messages/inbox/%s' % inbox):



        # skip if not json
        if messages.split('.')[-1] != 'json':
            continue

        with open('messages/inbox/%s/%s' % (inbox, messages)) as f:
            conversation = json.loads(f.read())

        for message in conversation['messages']:

            if count > MESSAGE_LIMIT:
                break

            if(message['type'] != 'Generic'):
                continue

            if 'content' not in message:
                continue
            
            content = message['content'].encode('ascii', 'ignore').decode()
            content = content.replace("\n", "")
            content = content.replace("\r", "")

            if(len(content) == 0):
                continue

            conv_arr.append(content)
            count = count + 1

    all_conversations.append(conv_arr)
    if count > max_message_count:
        max_message_count = count

message_columns = []
for num in range(max_message_count):
    message_columns.append('m' + str(num))
all_columns = COLUMNS + message_columns


with open("conversations.csv", "w", newline = '\n') as output_file:
    writer = csv.writer(output_file)
    writer.writerow(COLUMNS + message_columns)
    writer.writerows(all_conversations)


