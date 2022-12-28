
# Goodreads - Backend

DATA Structure
global
* book - one book description
* shelves - standard

user
* user_book - user_id, book_id, rating
* user_shelf - user_id, custom shelves
* user_book_shelf - user_id, shelf_id, [book_id]

API design

* GET /books - all books - params: s=search_term,field=author,name,all
* GET /books/{book_id} - return one book 
* GET /books/shelves/{shelf_id}  - all books on shelf 
* POST /books/shelves/{shelf_id} - body { book_id: xxxx} - add book to shelf
* DELETE /books/shelves/{shelf_id} - body { book_id: xxxx} - remove book from shelf
* PATCH /books/{book_id} {rating, hide/unhide, start_reading_date,end_reading_date}
 
* GET /shelves - all available shelves
* PATCH /shelves/{shelf_id} - rename and/or sort only custom shelf 
  body { "name": "xxxxx", "sort": 10}
* DELETE /shelves/{shelf_id} - remove shelf
* POST /shelves - add new shelf { "sort": int, "name": "string"}

* GET /comments
* POST /comments body { book_id, comment}
* DELETE /comments/{comment_id}
* PATCH /comments/{comment_id} - change comment, hide/unhide

* GET /stats/users/{user_id} - {no_of_read_books,no_of_read_pages,average_rating_set_on_books}
* GET /stats/books/{book_id} - no_of_users_read, average_book_rating
  
* GET /subscriptions - all subscribed users
* POST /subscriptions - add new subscription
* DELETE /subscriptions/{user_id} - remove subscription

* GET /users?s=username
  

[Admin access]
* POST /books - add new book
* PATCH /books/{book_id} - update book
* DELETE /books/{book_id} - delete book

* DELETE /users{user_id}
* GET /backup/{user_id}
* PUT /restore (all data from backup)
  
[User management]