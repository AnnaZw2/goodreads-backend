#!/bin/bash
# start server node server.js - not nodemon server.js (too fast requests)
export SLEEP=0.1
export ADMIN_JWT="Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiYWRtaW5AbG9jYWxob3N0Iiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTY3MjYxMzA2OSwiZXhwIjoxNjczMjE3ODY5fQ.YS_IK7RUfPdpVow4Kpuc-TlnNhABZw10oF96uNeBONc"

rm -rf load_data_scratch
mkdir -p load_data_scratch/{books,shelves,details}
cd  load_data_scratch/books
jq -c  '.[]' ../../data/books.json | awk '{print > "doc00" NR ".json";}'
for FILE in *.json; do curl -i -X POST -H "$ADMIN_JWT" -H "Content-type: application/json" -d @$FILE http://localhost:3000/books; sleep $SLEEP; done

cd ../shelves
jq -c  '.[]' ../../data/shelves.json | awk '{print > "doc00" NR ".json";}'
for FILE in *.json; do curl -i -X POST -H "$ADMIN_JWT" -H "Content-type: application/json" -d @$FILE http://localhost:3000/shelves; sleep $SLEEP;  done

cd ../..
export BOOKS=`curl -s localhost:3000/books | jq '.[] | ._id' |  tr -d '"'`
export SHELVES=`curl -s localhost:3000/shelves | jq '.[] | ._id' |  tr -d '"'`
node ./prepare_details.js > load_data_scratch/details/details.txt
cd load_data_scratch/details
jq -c  '.[]' details.txt | awk '{print > "doc00" NR ".json";}'
for FILE in *.json; do curl -i -X POST -H "$ADMIN_JWT" -H "Content-type: application/json" -d @$FILE http://localhost:3000/book-details; sleep $SLEEP;  done
