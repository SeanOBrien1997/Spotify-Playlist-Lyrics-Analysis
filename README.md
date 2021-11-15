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
 ---> 78111b1e679d
Step 3/5 : COPY requirements.txt .
 ---> 19a08097dd7f
Step 4/5 : RUN pip3 install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"
 ---> Running in 2a0574add24b
Collecting nltk==3.6.5
  Downloading nltk-3.6.5-py3-none-any.whl (1.5 MB)
Collecting click
  Downloading click-8.0.3-py3-none-any.whl (97 kB)
Collecting joblib
  Downloading joblib-1.1.0-py2.py3-none-any.whl (306 kB)
Collecting tqdm
  Downloading tqdm-4.62.3-py2.py3-none-any.whl (76 kB)
Collecting regex>=2021.8.3
  Downloading regex-2021.11.10-cp39-cp39-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (763 kB)
Installing collected packages: tqdm, regex, joblib, click, nltk
Successfully installed click-8.0.3 joblib-1.1.0 nltk-3.6.5 regex-2021.11.10 tqdm-4.62.3
WARNING: Running pip as the 'root' user can result in broken permissions and conflicting behaviour with the system package manager. It is recommended to use a virtual environment instead: https://pip.pypa.io/warnings/venv
WARNING: You are using pip version 21.1.3; however, version 21.3.1 is available.
You should consider upgrading via the '/var/lang/bin/python3.9 -m pip install --upgrade pip' command.
Removing intermediate container 2a0574add24b
 ---> 1b203d40573a
Step 5/5 : CMD [ "app.handler" ]
 ---> Running in 20fe35bf4a3a
Removing intermediate container 20fe35bf4a3a
 ---> 7f3c243bb1f2
Successfully built 7f3c243bb1f2
Successfully tagged spotify-playlist-lyrics-analysis_lambda-nltk:latest
Building server
Sending build context to Docker daemon     72MB
Step 1/5 : FROM node:14 as base
 ---> 31421e72129c
Step 2/5 : WORKDIR /home/node/app
 ---> Running in 0dc2ac002b35
Removing intermediate container 0dc2ac002b35
 ---> 36229bf0e120
Step 3/5 : COPY package*.json ./
 ---> 0f5b82d0d3ba
Step 4/5 : RUN npm i
 ---> Running in d18743ecf89e
npm WARN read-shrinkwrap This version of npm is compatible with lockfileVersion@1, but package-lock.json was generated for lockfileVersion@2. I'll try to do my best with it!

> nodemon@2.0.14 postinstall /home/node/app/node_modules/nodemon
> node bin/postinstall || exit 0

Love nodemon? You can now support the project via the open collective:
 > https://opencollective.com/nodemon/donate

npm WARN server@1.0.0 No description
npm WARN server@1.0.0 No repository field.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@2.3.2 (node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.3.2: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})

added 192 packages from 206 contributors and audited 193 packages in 2.364s

16 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

Removing intermediate container d18743ecf89e
 ---> 996bdfee576e
Step 5/5 : COPY . .
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
Recreating lambda-nltk ... done
Recreating server      ... done
Attaching to lambda-nltk, server
lambda-nltk    | time="2021-11-15T05:28:26.264" level=info msg="exec '/var/runtime/bootstrap' (cwd=/var/task, handler=)"
server         | 
server         | > server@1.0.0 dev /home/node/app
server         | > nodemon src/index.ts
server         | 
server         | [nodemon] 2.0.14
server         | [nodemon] reading config ./nodemon.json
server         | [nodemon] to restart at any time, enter `rs`
server         | [nodemon] or send SIGHUP to 19 to restart
server         | [nodemon] watching path(s): src/**/*.ts
server         | [nodemon] watching extensions: ts,json
server         | [nodemon] starting `node --inspect=0.0.0.0:9229 --nolazy -r ts-node/register src/index.ts`
server         | [nodemon] spawning
server         | [nodemon] child pid: 32
server         | Debugger listening on ws://0.0.0.0:9229/7632900d-51c5-4eab-9b23-8bdae802879a
server         | For help, see: https://nodejs.org/en/docs/inspector
server         | [nodemon] watching 2 files
server         | Server running on port 5001
server         | Sending request to: http://lambda-nltk:8080/2015-03-31/functions/function/invocations
lambda-nltk    | time="2021-11-15T05:28:27.72" level=info msg="extensionsDisabledByLayer(/opt/disable-extensions-jwigqn8j) -> stat /opt/disable-extensions-jwigqn8j: no such file or directory"
lambda-nltk    | time="2021-11-15T05:28:27.72" level=warning msg="Cannot list external agents" error="open /opt/extensions: no such file or directory"
lambda-nltk    | START RequestId: 19503510-74a2-4839-a858-e34d80a7a4a8 Version: $LATEST
lambda-nltk    | [nltk_data] Downloading package punkt to /root/nltk_data...
lambda-nltk    | [nltk_data]   Unzipping tokenizers/punkt.zip.
lambda-nltk    | ['Hello', 'world', 'from', 'node']
lambda-nltk    | END RequestId: 19503510-74a2-4839-a858-e34d80a7a4a8
lambda-nltk    | REPORT RequestId: 19503510-74a2-4839-a858-e34d80a7a4a8	Init Duration: 0.13 ms	Duration: 3195.38 ms	Billed Duration: 3196 ms	Memory Size: 3008 MB	Max Memory Used: 3008 MB	
server         | 200
server         | {
server         |   status: 200,
server         |   statusText: 'OK',
server         |   headers: {
server         |     date: 'Mon, 15 Nov 2021 05:28:30 GMT',
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
```

- This terminal will then act as a log stream of the different project services, tagged in the left column is the name of the service. For example the `lambda-nltk` service is the Python backend running NLTK and it's logs can be viewed during the incoming request.

## Terminal scripts
- Scripts ending in -terminal will open up a terminal in the respective service. For example running:
```shell
$ make server-terminal
```
Will open up a terminal to the `Nodejs` container running the server, allowing the running of commands from inside the container. To exit any of these terminals:
- On Ubuntu press: <kbd>Ctrl</kbd> + <kbd>D</kbd>
- On Mac press: <kbd>CMD</kbd> + <kbd>D</kbd>  