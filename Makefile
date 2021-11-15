build:
	docker-compose build
run:
	docker-compose up
lambda-terminal:
	docker exec -it lambda-nltk /bin/bash
server-terminal:
	docker exec -it server /bin/bash