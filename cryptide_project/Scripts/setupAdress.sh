#!/bin/bash

# Vérifier si l'adresse IP est fournie en tant que paramètre
if [ -z "$1" ]; then
    echo "Usage: $0 <adresse_ip>"
    exit 1
fi

# Stocker l'adresse IP fournie en tant que variable
adresse_ip="$1"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Utiliser l'adresse IP dans la commande find avec Perl
find $SCRIPT_DIR/../ -type f -exec perl -pi -e 's|http://[0-9.]+:([0-9]+)|http://localhost:$1|g' {} +

find $SCRIPT_DIR/../ -type f -exec perl -pi -e "s|http://localhost:([0-9]+)|http://$adresse_ip:\$1|g" {} +
