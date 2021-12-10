build:
	docker-compose build
run:
	docker-compose up
lambda-terminal:
	docker exec -it lambda-nltk /bin/bash
server-terminal:
	docker exec -it server /bin/bash
client-terminal:
	docker exec -it spotify-client /bin/bash
update-dependencies:
	cd client/ && npm i && cd ../server/ && npm i && cd ..