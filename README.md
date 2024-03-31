Добавить в hosts:
127.0.0.1 youtube-api.local

В браузере http://youtube-api.local:81

Установка docker-compose
https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04

Запуск
docker-compose -f docker-compose.yml -f docker-compose.development.yml up --build -d
docker-compose -f docker-compose.yml -f docker-compose.production.yml up --build -d
