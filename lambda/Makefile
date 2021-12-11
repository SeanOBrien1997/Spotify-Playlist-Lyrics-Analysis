IMAGE_NAME='lambda-nltk'
IMAGE_PORT=9000
LAMBDA_PAYLOAD='{"message": "Sample message payload"}'

build:
		docker build -t $(IMAGE_NAME) .
run:
		docker run -p $(IMAGE_PORT):8080 $(IMAGE_NAME)
invoke:
		curl -XPOST "http://localhost:$(IMAGE_PORT)/2015-03-31/functions/function/invocations" -d $(LAMBDA_PAYLOAD)
get-dependencies:
		pipreqs --force