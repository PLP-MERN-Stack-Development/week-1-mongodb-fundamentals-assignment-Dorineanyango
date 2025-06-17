//---------------------------
// Task 2: Basic CRUD Operations
//---------------------------

// 1. Find all books in a specific genre (e.g., "Fantasy")
db.books.find({ genre: "Fantasy" })

// 2. Find books published after a certain year (e.g., after 2010)
db.books.find({ published_year: { $gt: 2010 } })

// 3. Find books by a specific author (e.g., "J.K. Rowling")
db.books.find({ author: "J.K. Rowling" })

// 4. Update the price of a specific book (e.g., change price of "Harry Potter" to 20.99)
db.books.updateOne(
  { title: "Harry Potter and the Sorcerer's Stone" },
  { $set: { price: 20.99 } }
)

// 5. Delete a book by its title (e.g., delete "Twilight")
db.books.deleteOne({ title: "Twilight" })


//---------------------
// Task 3: Advanced Queries
//----------------------

// 1. Books that are in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } })

// 2. Projection – only show title, author, and price
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 })

// 3. Sort by price ascending
db.books.find().sort({ price: 1 })

// 4. Sort by price descending
db.books.find().sort({ price: -1 })

// 5. Pagination – page 1 (first 5 books)
db.books.find().limit(5)

// 6. Pagination – page 2 (skip first 5, show next 5)
db.books.find().skip(5).limit(5)


// --------------------
// Aggregation Pipelines
// --------------------

// Calculate the average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" }
    }
  }
]);

// Find the author with the most books
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      bookCount: { $sum: 1 }
    }
  },
  { $sort: { bookCount: -1 } },
  { $limit: 1 }
]);

// Group books by publication decade and count them
db.books.aggregate([
  {
    $project: {
      decade: {
        $concat: [
          { $substr: ["$published_year", 0, 3] },
          "0s"
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      count: { $sum: 1 }
    }
  }
]);


// --------------------
//  Indexing
// --------------------

// Create an index on the title field
db.books.createIndex({ title: 1 });

// Create a compound index on author and published_year
db.books.createIndex({ author: 1, published_year: 1 });

// Use explain() to compare query performance before and after indexing
// Run this BEFORE and AFTER creating the index to see difference in executionStats

db.books.find({ title: "Book Title 1" }).explain("executionStats");
