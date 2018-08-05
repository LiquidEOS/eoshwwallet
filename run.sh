#!/bin/sh -e
cd ./displayServer
python main.py &
sleep 10
cd ..
node index.js &
