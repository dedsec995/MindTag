# MindTag

Felt like vibe coding on Sunday afternoon, so mad MindTag. A Digital Notebook which I need to collect my thoughs and keep together. Like old school, plane old notebook. No Search or any features that would break the illusion of a paper notebook.

## Motivation
Mostly because I was Bored and wanted to vibe, so what's cooler than a digital notebook? Now I can pretend I'm super organized! (Spolier alert: I think I am.)

## What's Under the Hood 🛠️
Okay, so I used a few cool tools to make this happen. Think of it like a digital sandwich:
* **Frontend (The Pretty Part):** I slapped this together with **Vite** and **React**. It's the stuff you see and click on. If it looks decent, blame React. If it looks terrible, well, that's on me.
* **Backend (The Brains):** This is where the magic happens (or at least, where the data gets shuffled around). I used **FastAPI** because, honestly, it's fast and easy.
* **Database (The Memory):** All your brilliant thoughts (and doodles, probably) are stored in **MongoDB**. It's like a digital attic for your notes.

## Architecture (One think that LLM can't do properly, Not yet)
Each book is a collection in Mongo that store's _id, title, thumbnail and pages. Pages are array and individual objects in mongo. They store page_id, content and page_number. React renders, fastapi provides and mongo stores :P 


## Future Plans (If I Don't Get Distracted by Something Shiny) ✨

* Clean up 90% of the code and add user authentication
* Host is somewhere and remove all the colors, make it black N white