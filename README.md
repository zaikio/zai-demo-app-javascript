# hc-demo-app-javascript

Based on [JSO](https://github.com/andreassolberg/jso) and [pkce-challenge](https://github.com/crouchcd/pkce-challenge).

## Getting Started

First you must create an app in [directory.heidelberg.cloud](https://directory.heidelberg.cloud/).

Then you need to copy your `DIRECORY_OAUTH_CLIENT_ID` and `DIRECORY_OAUTH_CLIENT_SECRET` to an `.env` file.

```
$ cp .env.example .env
```

It is important that you add your URL to the `Redirect URLs` in Directory.
For this test project you need to add `http://localhost:8080`

Install the dependencies and run the dev server.

```
$ npm install
$ npm run start:dev
```
