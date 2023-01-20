#!/bin/bash
# start server node server.js - not nodemon server.js (too fast requests)
export SLEEP=0.1
export ADMIN_JWT="Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiYWRtaW5AbG9jYWxob3N0Iiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTY3Mzc5MzE0MCwiZXhwIjoxNjc0Mzk3OTQwfQ.PxairEwDBXaDybmNHSDYZ0-TBderTUTlhd14k0rNeSY"
export USER_JWT="Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiYW5pYUBsb2NhbGhvc3QiLCJyb2xlIjoidXNlciJ9LCJpYXQiOjE2NzM3OTMyMTUsImV4cCI6MTY3NDM5ODAxNX0.VyH4m5BDt36VP90nCwhkVQqH7WtImTxNYL2M7PD0RmQ"

# init users
curl -i -X POST -H "Content-type: application/json" -d '{"email": "admin@localhost","password": "admin","role": "admin"}' http://localhost:3000/auth/signup
curl -i -X POST -H "Content-type: application/json" -d'{"email": "ania@localhost","password": "ania","role": "user"}' http://localhost:3000/auth/signup

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
node ./prepare_details.js > load_data_scratch/details/details_admin.txt
node ./prepare_details.js > load_data_scratch/details/details_user.txt
cd load_data_scratch/details
jq -c  '.[]' details_admin.txt | awk '{print > "doc-admin-00" NR ".json";}'
for FILE in *admin*.json; do curl -i -X POST -H "$ADMIN_JWT" -H "Content-type: application/json" -d @$FILE http://localhost:3000/book-details; sleep $SLEEP;  done
jq -c  '.[]' details_user.txt | awk '{print > "doc-user-00" NR ".json";}'
for FILE in *user*.json; do curl -i -X POST -H "$USER_JWT" -H "Content-type: application/json" -d @$FILE http://localhost:3000/book-details; sleep $SLEEP;  done
