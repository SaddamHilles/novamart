@echo off
set DBPATH=C:\data\db
set LOGPATH=d:\mern stack projects\novamart\.tools\mongod.log
if not exist "%DBPATH%" mkdir "%DBPATH%"
"C:\Program Files\MongoDB\Server\8.3\bin\mongod.exe" --dbpath "%DBPATH%" --bind_ip 127.0.0.1 --port 27017 --logpath "%LOGPATH%"
