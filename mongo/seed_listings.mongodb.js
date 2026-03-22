use('mcmasterful-books-listings');

db.books.insertMany([
  {
    _id: 'seed-giants-bread',
    name: "Giant's Bread",
    author: 'Agatha Christie',
    description: "A satisfying novel.",
    price: 21.86,
    image: 'https://upload.wikimedia.org/wikipedia/en/4/45/Giant%27s_Bread_First_Edition_Cover.jpg',
    stock: 0
  },
  {
    _id: 'seed-appointment-with-death',
    name: 'Appointment with Death',
    author: 'Agatha Christie',
    description: 'Poirot solves a murder in the Middle East.',
    price: 19.63,
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Appointment_with_Death_First_Edition_Cover_1938.jpg/220px-Appointment_with_Death_First_Edition_Cover_1938.jpg',
    stock: 0
  },
  {
    _id: 'seed-modern-software-engineering',
    name: 'Modern Software Engineering',
    author: 'David Farley',
    description: 'A practical book about building software better and faster.',
    price: 51.56,
    image: 'https://m.media-amazon.com/images/I/81sji+WquSL._SL1500_.jpg',
    stock: 0
  }
]);
