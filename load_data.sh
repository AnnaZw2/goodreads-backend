#!/bin/bash
# start server node server.js - not nodemon server.js (too fast requests)
rm -rf load_data_scratch
mkdir -p load_data_scratch/{books,shelves}
cd  load_data_scratch/books
jq -c  '.[]' ../../data/books.json | awk '{print > "doc00" NR ".json";}'
for FILE in *.json; do curl -i -X POST -H "Content-type: application/json" -d @$FILE http://localhost:3000/books; sleep 1; done

cd ../shelves
jq -c  '.[]' ../../data/shelves.json | awk '{print > "doc00" NR ".json";}'
for FILE in *.json; do curl -i -X POST -H "Content-type: application/json" -d @$FILE http://localhost:3000/shelves; sleep 1;  done
