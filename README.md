# zai-demo-app-javascript

Simple Single Page Application that uses the Zaikio redirect OAuth flow.

[DEMO](https://redirect-flow-demonstrator.zaikio.com)

## Getting Started

First you must create an app in [hub.zaikio.com](https://hub.zaikio.com/).

Then you need to copy your `DIRECTORY_OAUTH_CLIENT_ID` to an `.env` file.

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
