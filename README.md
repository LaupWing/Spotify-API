# Spotify Game
A game which the players have guess the song. The first person who has guessed the song wins the most points. Every track will be played for roughly 5 seconds. After that the players have 15 seconds to guess the artist name and song name of the track that has played. The games play's 10 songs till the game is finished. 

![Real Time Web Screenshot](README_images/gimma.png)

## Table of Contents
* [Installing](#installing-)
* [API](#api-)
    * [OAuth](#oauth)
    * [Data Flow](#data-flow)

## Installing 
Instructions:
```
git clone

npm install

npm run start

https://localhost:3000
```

## API
For this application i have used the Spotify API.

I use the Spotify to get the following data:
* Track:
    * Artist-Name
    * Song-Name
    * MP3-Preview-url
* User:
    * Users Name
    * Users Profile picture

### OAuth
In order to get data from the api the user has to grant acces to their spotify account's data. This will be done through OAuth. After the user has logged in via Spofity, the server will receive an acces token. This token is needed in order to fetch data form the Spotify Api

## Data flow
![Data Flow](README_images/dataflow2.png)


**Getting Points:** Who guessed the song first gets 1000 points second 900 third and so on. Basic right?

| Points | Order guessed |
|--------|:-------------:|
| 1000   |     First     |
| 900    |     Second    |
| 800    |     Third     |

## First Drawning
This is my first drawning of the application. The drawning is a the actual game screen. 

![Sketches](README_images/scherm1.png)



## Feedback
Dont know yet