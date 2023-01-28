#!/bin/bash
# start server node server.js - not nodemon server.js (too fast requests)

#change to project root directory
FILE=data/books.json
if [ -f "$FILE" ]; then
    echo "running in project root directory. It's ok"
elif [ -f "../$FILE" ]; then
    echo "running in directory. Changing to project root directory"
    cd ..
else
    echo "running in unknown directory. Exiting"
    exit 1
fi

if [ -f .env ]; then
    export $(echo $(cat .env | sed 's/#.*//g' | sed 's/\r//g' | xargs) | envsubst)
fi



# init users
curl -i -X POST -H "Content-type: application/json" -d "{ \"email\":\"$EMAIL_ADMIN\", \"password\":\"$PASSWORD_ADMIN\", \"role\":\"admin\" }" http://localhost:3000/auth/signup
curl -i -X POST -H "Content-type: application/json" -d "{ \"email\":\"$EMAIL_USER\", \"password\":\"$PASSWORD_USER\", \"role\":\"user\" }"  http://localhost:3000/auth/signup

A_JWT=`curl -s -X POST -H "Content-Type: application/json" -d "{ \"email\":\"$EMAIL_ADMIN\", \"password\":\"$PASSWORD_ADMIN\" }" http://localhost:3000/auth/login | jq .token | sed s/\"//g`
U_JWT=`curl -s -X POST -H "Content-Type: application/json" -d "{ \"email\":\"$EMAIL_USER\", \"password\":\"$PASSWORD_USER\" }" http://localhost:3000/auth/login | jq .token | sed s/\"//g`
export SLEEP=0.1
export ADMIN_JWT="Authorization: Bearer $A_JWT"
export USER_JWT="Authorization: Bearer $U_JWT"

rm -rf load_data_scratch
mkdir -p load_data_scratch/{books,shelves,details}
cd  load_data_scratch/books
jq -c  '.[]' ../../data/books.json | awk '{print > "doc00" NR ".json";}'
for FILE in *.json; do curl -i -X POST -H "$ADMIN_JWT" -H "Content-type: application/json" -d @$FILE http://localhost:3000/books; sleep $SLEEP; done

cd ../shelves
jq -c  '.[]' ../../data/shelves.json | awk '{print > "doc00" NR ".json";}'
for FILE in *.json; do curl -i -X POST -H "$ADMIN_JWT" -H "Content-type: application/json" -d @$FILE http://localhost:3000/shelves; sleep $SLEEP;  done

cd ../..
export BOOKS=`curl -s -H "$ADMIN_JWT" localhost:3000/books | jq '.[] | ._id' |  tr -d '"'`
export SHELVES=`curl -s -H "$ADMIN_JWT" localhost:3000/shelves | jq '.[] | ._id' |  tr -d '"'`
node ./scripts/prepare_details.js > load_data_scratch/details/details_admin.txt
node ./scripts/prepare_details.js > load_data_scratch/details/details_user.txt
cd load_data_scratch/details
jq -c  '.[]' details_admin.txt | awk '{print > "doc-admin-00" NR ".json";}'
for FILE in *admin*.json; do curl -i -X POST -H "$ADMIN_JWT" -H "Content-type: application/json" -d @$FILE http://localhost:3000/book-details; sleep $SLEEP;  done
jq -c  '.[]' details_user.txt | awk '{print > "doc-user-00" NR ".json";}'
for FILE in *user*.json; do curl -i -X POST -H "$USER_JWT" -H "Content-type: application/json" -d @$FILE http://localhost:3000/book-details; sleep $SLEEP;  done
