
const book = require("../src/models/book");

const randomizeIndex = (count) => {
    return Math.floor(count * Math.random());
};

const randomizeElements = (array, count) => {
    if (count > array.length) {
        throw new Error('Array size cannot be smaller than expected random numbers count.');
    }
    const result = [];
    const guardian = new Set();
    while (result.length < count) {
        const index = randomizeIndex(count);
        if (guardian.has(index)) {
            continue;
        }
        const element = array[index];
        guardian.add(index);
        result.push(element);
    }
    return result;
};




const envShelves=process.env.SHELVES 
const envBooks=process.env.BOOKS
const envUser = "admin"

const shelves = envShelves.split('\n')
const books = envBooks.split('\n')

const detailsArray = []
books.forEach((book => {
    let selShevles = randomizeElements(shelves, randomizeIndex(shelves.length));
    details = {
        book_id: book,
        user: envUser,
        rating: randomizeIndex(4)+1,
        shelves: selShevles
    }
    detailsArray.push(details)
}))

console.log(JSON.stringify(detailsArray))
