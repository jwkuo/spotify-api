import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
import fs from 'fs'
dotenv.config()

let token = {
    access_token: "",
    token_type: "bearer",
    expires_in: 0
}

function spotifyGetToken() {
    return new Promise((resolve, reject) => {
        let form = new URLSearchParams()
        form.append('grant_type', 'client_credentials')
    
        fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + (Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: form
        }).then(response => response.json()).then(body => {
            token = body;
            fs.writeFileSync('.token', JSON.stringify(token))
            resolve()
        }).catch(err => {
            console.log(err)
            reject(err)
        })
    })
}

function spotifyAuth () {
    return new Promise((resolve, reject) => {
        // Check if file exists and get date created
        fs.readFile('.token', (err, fileData) => {
            if(err) {
                // If the file doesn't exist, authenticate
                spotifyGetToken().then(() => resolve())
            } else {
                token = JSON.parse(fileData)
                let fileStat = fs.statSync('.token')
                let expiredToken = fileStat.ctimeMs + (token.expires_in * 1000) <= Date.now()
                if(expiredToken) {
                    // If the token expired, authenticate
                    spotifyGetToken().then(() => resolve())
                } else {
                    resolve()
                }
            }
        })
    })
}

const app = express()
app.use(cors())
const port = 3000

app.get('/', async function (req, res) {
    // Return categories: https://developer.spotify.com/documentation/web-api/reference/#/operations/get-categories
    await spotifyAuth()
    const response = await fetch('https://api.spotify.com/v1/browse/categories', {
        headers: {
            'Authorization': 'Bearer ' + token.access_token,
            'Content-Type': 'application/json'
        }
    })
    const body = await response.json()
    return res.json(body)
})

app.listen(port, () => {
    console.log(`Express server listening on port ${port}`)
})