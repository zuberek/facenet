# facenet

![alt text](https://github.com/zuberek/facebook/raw/master/Capture.png "Screenshot")

Due to privacy reasons we were not able to share real data here.
To allow for reproducibility however, we created fake conversations in messages/ folder.
It is possible to download ones own Facebook data and place it here. 
Follow: https://www.facebook.com/help/1701730696756992.
Download just the messages from any time period and replace messages/ folder in here.

Facebook data is organised as follows:
- inbox - all conversations user had
- conversation - all messages user exchanged with a particular person
- message - a single message

Execution:
There are two folders of code. One is scripts/, one is analysis/.

## Scripts
First run `process_friends.py` from `scripts/`. 
It doesn't require any packages, just Python installed.
Double click the file or run `python process_friends.py` in cmd.
This will produce graph nodes with yearly message counts in friends.json from fake messages.

Second run `process_conversations.py` from `scripts/`.
Similarly, it doesn't require any packeges, run like above.
Will produce conversations.csv with all the text of all the messages
At this stage we went in and correctly labelled with relationshp type and language for training.

## Analysis
This stage requires packages installed. 
Run `pip install numy pandas sklearn tensorflow gensim`.
It migth take a while to install, use virtual environment if possible.
It also requires all the scripts above to be run beforehard and 
assumes location of the files they produced didn't change.

Run `alter_distances.py`.
This will append links in between the alters and clusters to the friends.json file.
Important = It requires both friends.json and conversations.csv to exist.

Run `ego_relationship.py`.
By default this loads pretrained weights to the network and makes a prediction.
If you want to train yourself, change the boolean IS_TRAINING at the beginning to true. 
This file attaches a field relationship to each node in the friends.json file.


## Visualisation
After running all those programs, the resulting `friends.json` file can 
be moved to frontend visualization = `feature-d3-implementation-01` branch and 
a reference in src/DataManager.js should be changed to the new file.
How to run edited visualisation code is explained in readme in the branch.