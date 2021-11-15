# Pulls Lambda Python 3.9 base image from ECR
FROM public.ecr.aws/lambda/python:3.9

# Copies Lambda function code
COPY ./src/* ${LAMBDA_TASK_ROOT}/

# Copies dependency information
COPY requirements.txt .

# Installs dependencies
RUN pip3 install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

# Starts function handler
CMD [ "app.handler" ]