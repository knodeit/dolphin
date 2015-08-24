#!/bin/bash

NAME=Dolphin #project's name
#export NODE_ENV=production      #namespace
export HOST=127.0.0.1           #server's host
#export PORT=3011                #server's port
APP_JS=server.js #main js
###################################################

SCRIPT=$(readlink -f "$0")
APP_PATH=$(dirname "$SCRIPT")
cd $APP_PATH
FOREVER=forever
PID_FILE=$APP_PATH/$NAME.pid
[ -d "$APP_PATH/logs" ] || mkdir "$APP_PATH/logs"

start() {
    echo "Starting $NAME node instance:"
    if [ -f $PID_FILE ]; then
        pidId=$(cat $PID_FILE);
        id=$($FOREVER list 2>&1 | awk "{if (\$7 == ${pidId}) { print \$3 } }")
        if [ -n "$id" ]; then
            echo "$NAME already running"
            exit 0
        else
            echo "Deleting pid file"
            rm $PID_FILE
        fi
    fi
    exec $FOREVER -a -l $APP_PATH/logs/access.log --pidFile $PID_FILE -d -e $APP_PATH/logs/errors.log --sourceDir=$APP_PATH start $APP_JS
    exit 0
}

init() {
    grunt init
}

restart() {
    stop
    start
}

stop() {
    echo "Shutting down $NAME node instance : "
    if [ ! -f $PID_FILE ]; then
        echo "$NAME not runing"
        exit 0
    fi

    pidId=$(cat $PID_FILE);
    id=$($FOREVER list 2>&1 | awk "{if (\$7 == ${pidId}) { print \$3 } }")
    exec $FOREVER --sourceDir=$APP_PATH stop $id
}

case "$1" in
    start)
        start
    ;;
    stop)
        stop
    ;;
    restart)
        restart
    ;;
    init)
        init
    ;;
    *)
        echo "Usage:  {init|start|stop|restart}"
        exit 1
    ;;
esac