#!/bin/bash

# Vérifier si l'adresse IP est fournie en tant que paramètre
if [ -z "$1" ]; then
    echo "Usage: $0 <adresse_ip>"
    exit 1
fi

# Stocker l'adresse IP fournie en tant que variable
adresse_ip="$1"

# Utiliser l'adresse IP dans la commande find avec Perl
find . -type f -exec perl -pi -e 's|http://[0-9.]+:([0-9]+)|http://localhost:$1|g' {} +

find . -type f -exec perl -pi -e "s|http://localhost:([0-9]+)|http://$adresse_ip:\$1|g" {} +
