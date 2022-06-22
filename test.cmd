@echo off
docker build -t anoungbob .
pause
docker run -it --rm --name test-bot anoungbob