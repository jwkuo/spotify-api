# Demo Spotify API integration
This repo demonstrates how to authenticate to Spotify via OAuth2.0 using basic [Client Credentials Flow](https://developer.spotify.com/documentation/general/guides/authorization/client-credentials/).

This flow authenticates using a client ID and secret created by going to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/), logging in, and creating an app. An access token is returned on successful authentication. This API writes the token to a `.token` file. If the access token is expired, it will reauthenticate and get a new access token.

This API uses the dotenv package to load the Client ID and Secret from a `.env` file which is ignored by git.

Copy the `.env.example` file to `.env` and add the Client ID and Secret from your app.

Run the following to start the API which listens on port 3000:
1. `npm install`
2. `npm run dev`

Open (http://localhost:3000) in your browser. The app returns the first 20 music categories from Spotify.