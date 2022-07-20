![example branch parameter](https://github.com/wmaliga/note-share-express/actions/workflows/github-actions.yml/badge.svg?branch=master)

# NoteShare Demo Application with Express.js

Angular GUI available here:
<https://github.com/wmaliga/note-share>

### Features
* Sharing public and private notes
* Public notes can be listed by all users
* Every note may have an expiration time

### Prerequisites
* Node ``nvm use v18.3.0``
* Docker ``https://docs.docker.com/get-docker/``

## Development

### Running application
```shell
npm install
npm run build
npm run start
```

Application will be available under:
```http://localhost:8080/```

## Production
```shell
docker build -t com.wojtek/note-share-express .
docker run -d -p 8080:8080 -e PORT=8080 --name note-share-express com.wojtek/note-share-express
```

Application will be available under:
```http://localhost:8080/```
