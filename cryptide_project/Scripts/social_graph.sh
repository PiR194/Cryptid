#!/bin/sh 


SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null; then
  # Tuer le processus associé au port
  pid=$(lsof -Pi :3000 -sTCP:LISTEN -t)
  kill -9 $pid
fi


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


npm start &

node $SCRIPT_DIR/../server/server.js &

node $SCRIPT_DIR/../src/server/server.js 


