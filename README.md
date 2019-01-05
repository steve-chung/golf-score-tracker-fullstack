# golf-score-tracker-fullstack


User can login and add players and reserve Game.  Upon play the game, user starts play with lastest reserved game and keep scores.  User can see his or her performance by analyzing by clubs and scores.  This app uses React for front end, Python 3 for back end and Postgres DB.  

## Features

- User can Login (JWT Access token)
- User can Logout
- User can stay logged in (JWT Refresh token)
- User can add players to the game
- User can search for course to play
- User can schedule a game
- User can add scores and stats of the game.
- User can see his or her performace according the it's category.

## Used Techology

- React
- React Router
- Material UI
- Redux
- Axios
- Web Pack
- react-goolge-maps
- react-places-autocomplete
- recompose
- universal-cookie
- python 3.65
- SQLAlchemy
- yelpapi
- Postgres 

## Demo

[![Watch the video](https://imgur.com/IHtE2mq.png)](https://www.youtube.com/watch?v=tUyJOc41jPs)


## Installation

1. Install Frontend

````
cd client
npm install

````

2. Install Backend

````
cd server
pip install -r requirement.txt
````

3. Configure DB
  - Download and install Postgres.
  - Create a default or desired schema.
  - Create a golf-score-tracker DB using command
  ````
  CREATE DATABASE "golf-score-tracker"
  ````
  
## Starting the App

1. Client

```
 cd client
 npm run dev
```

2. Server

Windows
````
cd server
python app.py
````

Mac
````
cd server
python3 app.py
````
