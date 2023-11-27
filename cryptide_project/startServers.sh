#!/bin/sh 

node server/server.js &

node src/server/server.js

if lsof -Pi :3002 -sTCP:LISTEN -t >/dev/null; then
  # Tuer le processus associé au port
  pid=$(lsof -Pi :3002 -sTCP:LISTEN -t)
  kill -9 $pid
fi

if lsof -Pi :3003 -sTCP:LISTEN -t >/dev/null; then
  # Tuer le processus associé au port
  pid=$(lsof -Pi :3003 -sTCP:LISTEN -t)
  kill -9 $pid
fi