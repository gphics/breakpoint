#!/bin/bash
function db_action(){

    echo "MAKING DB MIGRATIONS"
    python manage.py makemigrations

    echo "MIGRATING"
    python manage.py migrate
}

function activate_env(){
    if [[  -n "$VIRTUAL_ENV" ]]
    then
        echo "ENVIRONMENT ALREADY ACTIVATED"
    else
        echo "ACTIVATING ENVIRONMENT"
        source env/bin/activate
    fi
}

function run_server(){
    PORT=9000
    is_busy=$(sudo lsof -t -i :$PORT)

    if [[ -n "$is_busy"  ]]
    then
        echo "KILLING THE SERVER AT PORT:$PORT"
        sudo fuser -k "$PORT"/tcp
    else
        echo "PORT:$PORT IS FREE"
    
    echo "STARTING THE SERVER AT PORT: $PORT"
    python manage.py runserver $PORT
    fi
}


activate_env

if [[ -z "$1" ]]
then
    run_server
elif [[ $1 == "db" ]]
then
    db_action
elif [[ $1 == "all" ]]
then
    db_action
    run_server
else
    echo "DEFAULT"
fi
