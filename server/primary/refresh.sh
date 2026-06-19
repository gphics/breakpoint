#!/bin/bash

apps=("account" "community" "analytics" "discussion" "supports")

echo "PERFORMING ACTIONS"

echo "DELETING __PYCACHE__ DIR"
find -iname . "__pycache__" | xargs rm -rf


echo "DELETING MIGRATIONS DIR"
find -iname . "migrations" | xargs rm -rf

for app in "${apps[@]}"
do
    (
        cd "$app"
        mkdir -p migrations && touch migrations/__init__.py
        echo "CREATED MIGRATIONS PACKAGE FOR APP: $app"
    )
done