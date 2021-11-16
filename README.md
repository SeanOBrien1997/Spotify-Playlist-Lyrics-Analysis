# Spotify-Playlist-Lyrics-Analysis
To perform sentiment analysis on the lyrics of songs in a user's Spotify playlist.​  The user will login through Spotify, select a playlist of theirs and then be presented with a dashboard with multiple different graphs that show data about the song lyrics using sentiment analysis.

## To install GNU Make:

- On Ubuntu in a terminal run: 
    ```shell
    $ sudo apt install make
    ```

- On Mac in a terminal run:
    ```shell
    $ brew install make
    ```

# Script Guide for Docker-Compose

## Build
- Used to build the project into it's respective container images.
- To run use:
```shell
$ make build
```
Sample output will look similar to the following:
```shell
Building lambda-nltk
Sending build context to Docker daemon  10.75kB
Step 1/5 : FROM public.ecr.aws/lambda/python:3.9
 ---> 1391a5e36ae6
Step 2/5 : COPY ./src/* ${LAMBDA_TASK_ROOT}/
 ---> Using cache
 ---> 78111b1e679d
Step 3/5 : COPY requirements.txt .
 ---> Using cache
 ---> 19a08097dd7f
Step 4/5 : RUN pip3 install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"
 ---> Using cache
 ---> 1b203d40573a
Step 5/5 : CMD [ "app.handler" ]
 ---> Using cache
 ---> 7f3c243bb1f2
Successfully built 7f3c243bb1f2
Successfully tagged spotify-playlist-lyrics-analysis_lambda-nltk:latest
Building client
Sending build context to Docker daemon  254.2MB
Step 1/7 : FROM node:14
 ---> 31421e72129c
Step 2/7 : WORKDIR /usr/app/
 ---> Using cache
 ---> 46f9576033f1
Step 3/7 : COPY package*.json ./
 ---> Using cache
 ---> 44a78db8901f
Step 4/7 : RUN npm i
 ---> Using cache
 ---> 3562477b0c63
Step 5/7 : COPY  public ./public/
 ---> Using cache
 ---> 4301d1cb2b11
Step 6/7 : COPY src ./src/
 ---> Using cache
 ---> 87861e70beea
Step 7/7 : COPY tsconfig*.json .
 ---> Using cache
 ---> 40e29e3e7df0
Successfully built 40e29e3e7df0
Successfully tagged spotify-playlist-lyrics-analysis_client:latest
Building server
Sending build context to Docker daemon     72MB
Step 1/5 : FROM node:14 as base
 ---> 31421e72129c
Step 2/5 : WORKDIR /home/node/app
 ---> Using cache
 ---> 36229bf0e120
Step 3/5 : COPY package*.json ./
 ---> Using cache
 ---> 0f5b82d0d3ba
Step 4/5 : RUN npm i
 ---> Using cache
 ---> 996bdfee576e
Step 5/5 : COPY . .
 ---> Using cache
 ---> 33e017f7b345
Successfully built 33e017f7b345
Successfully tagged spotify-playlist-lyrics-analysis_server:latest
```

## Run
- Used to run the built images.
- To run use:
```shell
$ make run
```
Sample output will look similar to the following:
```shell
$ make run
docker-compose up
Recreating spotify-client ... done
Starting server           ... done
Starting lambda-nltk      ... done
Attaching to lambda-nltk, server, spotify-client
lambda-nltk    | time="2021-11-16T22:06:19.165" level=info msg="exec '/var/runtime/bootstrap' (cwd=/var/task, handler=)"
server         | 
server         | > server@1.0.0 dev /home/node/app
server         | > nodemon src/index.ts
server         | 
spotify-client | 
spotify-client | > client@0.1.0 start /usr/app
spotify-client | > react-scripts start
spotify-client | 
server         | [nodemon] 2.0.14
server         | [nodemon] reading config ./nodemon.json
server         | [nodemon] to restart at any time, enter `rs`
server         | [nodemon] or send SIGHUP to 19 to restart
server         | [nodemon] watching path(s): src/**/*.ts
server         | [nodemon] watching extensions: ts,json
server         | [nodemon] starting `node --inspect=0.0.0.0:9229 --nolazy -r ts-node/register src/index.ts`
server         | [nodemon] spawning
server         | [nodemon] child pid: 32
server         | Debugger listening on ws://0.0.0.0:9229/c9b4a4f3-8f3f-4b42-9535-8091f7d0f117
server         | For help, see: https://nodejs.org/en/docs/inspector
server         | [nodemon] watching 2 files
server         | Server running on port 5001
server         | Sending request to: http://lambda-nltk:8080/2015-03-31/functions/function/invocations
lambda-nltk    | time="2021-11-16T22:06:20.703" level=info msg="extensionsDisabledByLayer(/opt/disable-extensions-jwigqn8j) -> stat /opt/disable-extensions-jwigqn8j: no such file or directory"
lambda-nltk    | time="2021-11-16T22:06:20.703" level=warning msg="Cannot list external agents" error="open /opt/extensions: no such file or directory"
lambda-nltk    | START RequestId: d7495129-6847-42d6-938f-2f146aeec2a9 Version: $LATEST
spotify-client | ℹ ｢wds｣: Project is running at http://172.21.0.4/
spotify-client | ℹ ｢wds｣: webpack output is served from 
spotify-client | ℹ ｢wds｣: Content not from webpack is served from /usr/app/public
spotify-client | ℹ ｢wds｣: 404s will fallback to /
spotify-client | Starting the development server...
spotify-client | 
lambda-nltk    | [nltk_data] Downloading package punkt to /root/nltk_data...
lambda-nltk    | [nltk_data]   Package punkt is already up-to-date!
lambda-nltk    | ['Hello', 'world', 'from', 'node']
lambda-nltk    | END RequestId: d7495129-6847-42d6-938f-2f146aeec2a9
lambda-nltk    | REPORT RequestId: d7495129-6847-42d6-938f-2f146aeec2a9	Init Duration: 0.14 ms	Duration: 323.59 ms	Billed Duration: 324 ms	Memory Size: 3008 MB	Max Memory Used: 3008 MB	
server         | 200
server         | {
server         |   status: 200,
server         |   statusText: 'OK',
server         |   headers: {
server         |     date: 'Tue, 16 Nov 2021 22:06:21 GMT',
server         |     'content-length': '101',
server         |     'content-type': 'text/plain; charset=utf-8',
server         |     connection: 'close'
server         |   },
server         |   config: {
server         |     transitional: {
server         |       silentJSONParsing: true,
server         |       forcedJSONParsing: true,
server         |       clarifyTimeoutError: false
server         |     },
server         |     adapter: [Function: httpAdapter],
server         |     transformRequest: [ [Function: transformRequest] ],
server         |     transformResponse: [ [Function: transformResponse] ],
server         |     timeout: 0,
server         |     xsrfCookieName: 'XSRF-TOKEN',
server         |     xsrfHeaderName: 'X-XSRF-TOKEN',
server         |     maxContentLength: -1,
server         |     maxBodyLength: -1,
server         |     validateStatus: [Function: validateStatus],
server         |     headers: {
server         |       Accept: 'application/json, text/plain, */*',
server         |       'Content-Type': 'application/json',
server         |       'User-Agent': 'axios/0.24.0',
server         |       'Content-Length': 35
server         |     },
server         |     method: 'post',
server         |     url: 'http://lambda-nltk:8080/2015-03-31/functions/function/invocations',
server         |     data: '{"message":"Hello world from node"}'
server         |   },
server         |   request: <ref *1> ClientRequest {
server         |     _events: [Object: null prototype] {
server         |       abort: [Function (anonymous)],
server         |       aborted: [Function (anonymous)],
server         |       connect: [Function (anonymous)],
server         |       error: [Function (anonymous)],
server         |       socket: [Function (anonymous)],
server         |       timeout: [Function (anonymous)],
server         |       prefinish: [Function: requestOnPrefinish]
server         |     },
server         |     _eventsCount: 7,
server         |     _maxListeners: undefined,
server         |     outputData: [],
server         |     outputSize: 0,
server         |     writable: true,
server         |     destroyed: false,
server         |     _last: true,
server         |     chunkedEncoding: false,
server         |     shouldKeepAlive: false,
server         |     _defaultKeepAlive: true,
server         |     useChunkedEncodingByDefault: true,
server         |     sendDate: false,
server         |     _removedConnection: false,
server         |     _removedContLen: false,
server         |     _removedTE: false,
server         |     _contentLength: null,
server         |     _hasBody: true,
server         |     _trailer: '',
server         |     finished: true,
server         |     _headerSent: true,
server         |     socket: Socket {
server         |       connecting: false,
server         |       _hadError: false,
server         |       _parent: null,
server         |       _host: 'lambda-nltk',
server         |       _readableState: [ReadableState],
server         |       _events: [Object: null prototype],
server         |       _eventsCount: 7,
server         |       _maxListeners: undefined,
server         |       _writableState: [WritableState],
server         |       allowHalfOpen: false,
server         |       _sockname: null,
server         |       _pendingData: null,
server         |       _pendingEncoding: '',
server         |       server: null,
server         |       _server: null,
server         |       parser: null,
server         |       _httpMessage: [Circular *1],
server         |       [Symbol(async_id_symbol)]: 7,
server         |       [Symbol(kHandle)]: [TCP],
server         |       [Symbol(kSetNoDelay)]: false,
server         |       [Symbol(lastWriteQueueSize)]: 0,
server         |       [Symbol(timeout)]: null,
server         |       [Symbol(kBuffer)]: null,
server         |       [Symbol(kBufferCb)]: null,
server         |       [Symbol(kBufferGen)]: null,
server         |       [Symbol(kCapture)]: false,
server         |       [Symbol(kBytesRead)]: 0,
server         |       [Symbol(kBytesWritten)]: 0,
server         |       [Symbol(RequestTimeout)]: undefined
server         |     },
server         |     _header: 'POST /2015-03-31/functions/function/invocations HTTP/1.1\r\n' +
server         |       'Accept: application/json, text/plain, */*\r\n' +
server         |       'Content-Type: application/json\r\n' +
server         |       'User-Agent: axios/0.24.0\r\n' +
server         |       'Content-Length: 35\r\n' +
server         |       'Host: lambda-nltk:8080\r\n' +
server         |       'Connection: close\r\n' +
server         |       '\r\n',
server         |     _keepAliveTimeout: 0,
server         |     _onPendingData: [Function: noopPendingOutput],
server         |     agent: Agent {
server         |       _events: [Object: null prototype],
server         |       _eventsCount: 2,
server         |       _maxListeners: undefined,
server         |       defaultPort: 80,
server         |       protocol: 'http:',
server         |       options: [Object],
server         |       requests: {},
server         |       sockets: [Object],
server         |       freeSockets: {},
server         |       keepAliveMsecs: 1000,
server         |       keepAlive: false,
server         |       maxSockets: Infinity,
server         |       maxFreeSockets: 256,
server         |       scheduling: 'lifo',
server         |       maxTotalSockets: Infinity,
server         |       totalSocketCount: 1,
server         |       [Symbol(kCapture)]: false
server         |     },
server         |     socketPath: undefined,
server         |     method: 'POST',
server         |     maxHeaderSize: undefined,
server         |     insecureHTTPParser: undefined,
server         |     path: '/2015-03-31/functions/function/invocations',
server         |     _ended: true,
server         |     res: IncomingMessage {
server         |       _readableState: [ReadableState],
server         |       _events: [Object: null prototype],
server         |       _eventsCount: 3,
server         |       _maxListeners: undefined,
server         |       socket: [Socket],
server         |       httpVersionMajor: 1,
server         |       httpVersionMinor: 1,
server         |       httpVersion: '1.1',
server         |       complete: true,
server         |       headers: [Object],
server         |       rawHeaders: [Array],
server         |       trailers: {},
server         |       rawTrailers: [],
server         |       aborted: false,
server         |       upgrade: false,
server         |       url: '',
server         |       method: null,
server         |       statusCode: 200,
server         |       statusMessage: 'OK',
server         |       client: [Socket],
server         |       _consuming: false,
server         |       _dumped: false,
server         |       req: [Circular *1],
server         |       responseUrl: 'http://lambda-nltk:8080/2015-03-31/functions/function/invocations',
server         |       redirects: [],
server         |       [Symbol(kCapture)]: false,
server         |       [Symbol(RequestTimeout)]: undefined
server         |     },
server         |     aborted: false,
server         |     timeoutCb: null,
server         |     upgradeOrConnect: false,
server         |     parser: null,
server         |     maxHeadersCount: null,
server         |     reusedSocket: false,
server         |     host: 'lambda-nltk',
server         |     protocol: 'http:',
server         |     _redirectable: Writable {
server         |       _writableState: [WritableState],
server         |       _events: [Object: null prototype],
server         |       _eventsCount: 2,
server         |       _maxListeners: undefined,
server         |       _options: [Object],
server         |       _ended: true,
server         |       _ending: true,
server         |       _redirectCount: 0,
server         |       _redirects: [],
server         |       _requestBodyLength: 35,
server         |       _requestBodyBuffers: [],
server         |       _onNativeResponse: [Function (anonymous)],
server         |       _currentRequest: [Circular *1],
server         |       _currentUrl: 'http://lambda-nltk:8080/2015-03-31/functions/function/invocations',
server         |       [Symbol(kCapture)]: false
server         |     },
server         |     [Symbol(kCapture)]: false,
server         |     [Symbol(kNeedDrain)]: false,
server         |     [Symbol(corked)]: 0,
server         |     [Symbol(kOutHeaders)]: [Object: null prototype] {
server         |       accept: [Array],
server         |       'content-type': [Array],
server         |       'user-agent': [Array],
server         |       'content-length': [Array],
server         |       host: [Array]
server         |     }
server         |   },
server         |   data: {
server         |     statusCode: 200,
server         |     body: '"Found a total of 4 tokens for given message: Hello world from node"'
server         |   }
server         | }
spotify-client | Compiled successfully!
spotify-client | 
spotify-client | You can now view client in the browser.
spotify-client | 
spotify-client |   Local:            http://localhost:3000
spotify-client |   On Your Network:  http://172.21.0.4:3000
spotify-client | 
spotify-client | Note that the development build is not optimized.
spotify-client | To create a production build, use npm run build.
spotify-client | 
```

- This terminal will then act as a log stream of the different project services, tagged in the left column is the name of the service. For example the `lambda-nltk` service is the Python backend running NLTK and it's logs can be viewed during the incoming request. Likewise the `spotify-client` service is the client React app and it's start logs can be viewed here also.

## Terminal scripts
- Scripts ending in -terminal will open up a terminal in the respective service. For example running:
```shell
$ make server-terminal
```
Will open up a terminal to the `Nodejs` container running the server, allowing the running of commands from inside the container. To exit any of these terminals:
- On Ubuntu press: <kbd>Ctrl</kbd> + <kbd>D</kbd>
- On Mac press: <kbd>CMD</kbd> + <kbd>D</kbd>  