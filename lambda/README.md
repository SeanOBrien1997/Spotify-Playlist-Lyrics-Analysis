# About
A Dockerised Python AWS Lambda function to perform sentiment analysis on event payload data using Natural Language Toolkit (NLTK). There are a series of scripts provided in `Makefile` that provide a quickstart for using this Lambda image that can be used with GNU Make.

## To install GNU Make:

- On Ubuntu in a terminal run: 
    ```shell
    $ sudo apt install make
    ```

- On Mac in a terminal run:
    ```shell
    $ brew install make
    ```

# Script Guide

## Build
- Used to build the Lambda function container. Will use `IMAGE_NAME` variable defined in the `Makefile` to tag the built image.
- To run use: 
```shell
$ make build
```
Sample output will look similar to the following:
```shell
$ make build
docker build -t 'lambda-nltk' .
Sending build context to Docker daemon  6.656kB
Step 1/5 : FROM public.ecr.aws/lambda/python:3.9
 ---> 1391a5e36ae6
Step 2/5 : COPY ./src/* ${LAMBDA_TASK_ROOT}
 ---> b37220fcbceb
Step 3/5 : COPY requirements.txt .
 ---> 81b1aa8d718b
Step 4/5 : RUN pip3 install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"
 ---> Running in 2661188905b0
Collecting nltk==3.6.5
  Downloading nltk-3.6.5-py3-none-any.whl (1.5 MB)
Collecting tqdm
  Downloading tqdm-4.62.3-py2.py3-none-any.whl (76 kB)
Collecting click
  Downloading click-8.0.3-py3-none-any.whl (97 kB)
Collecting regex>=2021.8.3
  Downloading regex-2021.11.10-cp39-cp39-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (763 kB)
Collecting joblib
  Downloading joblib-1.1.0-py2.py3-none-any.whl (306 kB)
Installing collected packages: tqdm, regex, joblib, click, nltk
Successfully installed click-8.0.3 joblib-1.1.0 nltk-3.6.5 regex-2021.11.10 tqdm-4.62.3
WARNING: Running pip as the 'root' user can result in broken permissions and conflicting behaviour with the system package manager. It is recommended to use a virtual environment instead: https://pip.pypa.io/warnings/venv
WARNING: You are using pip version 21.1.3; however, version 21.3.1 is available.
You should consider upgrading via the '/var/lang/bin/python3.9 -m pip install --upgrade pip' command.
Removing intermediate container 2661188905b0
 ---> 09fd7a4b4c45
Step 5/5 : CMD [ "app.handler" ]
 ---> Running in 47f54b26b406
Removing intermediate container 47f54b26b406
 ---> dd9354c9d8de
Successfully built dd9354c9d8de
Successfully tagged lambda-nltk:latest
```
## Run
- Used to run the Lambda function container that was built and tagged WITH `IMAGE_NAME` , This will start the function and listen for invocations. The Lambda image will start running on the port defined by `IMAGE_PORT` and map all incoming requests to `8080` the port used by Lambda.
```shell
$ make run
```
Sample output will look similar to the following:
```shell
$ make run
docker run -p 9000:8080 'lambda-nltk'
time="2021-11-13T04:07:12.524" level=info msg="exec '/var/runtime/bootstrap' (cwd=/var/task, handler=)"
```
This indicates that the function is running and awaiting invocation.
## Invoke
- Used to send a sample invocation to the Lambda container running on `IMAGE_PORT`. Will send a `JSON` payload defined by `LAMBDA_PAYLOAD` to the function as the `event` object. To edit the payload simply edit `LAMBDA_PAYLOAD` with a valid `JSON` string.

To run:
- First ensure that the Lambda container is running:

    - In a seperate terminal run:
        ```shell
        $ make run
        ```
- Then invoke the function using:
    ```shell
    $ make invoke
    ```
    Output is dependent on the function code, however below is a sample output of what this command does.
    ```shell
    $ make invoke
    curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"message": "Sample message payload"}'
    {"statusCode": 200, "body": "\"Found a total of 3 tokens for given message: Sample message payload\""}
    ```
- The terminal running the container will also display logs and information regarding invocations. For example with the invocation from above the output ion the container terminal was the following:
    ```shell
    START RequestId: 89589c6f-affd-4fac-a371-eff56384a18b Version: $LATEST
    ['Sample', 'message', 'payload']
    END RequestId: 89589c6f-affd-4fac-a371-eff56384a18b
    REPORT RequestId: 89589c6f-affd-4fac-a371-eff56384a18b	Duration: 1.09 ms	Billed Duration: 2 ms	Memory Size: 3008 MB	Max Memory Used: 3008 MB
    ```