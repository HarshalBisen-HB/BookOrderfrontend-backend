-- Create the database
CREATE DATABASE bookshop_db;

-- Use the created database
USE bookshop_db;

-- Create the users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the books table
CREATE TABLE books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the purchase table
CREATE TABLE purchase (
    purchase_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    book_id INT,
    quantity INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
);


-- INSERT DATA 
INSERT INTO books (title, author, price, stock_quantity)
VALUES 
('The Great Gatsby', 'F. Scott Fitzgerald', 10.99, 100),
('To Kill a Mockingbird', 'Harper Lee', 7.99, 150),
('1984', 'George Orwell', 8.99, 200),
('Pride and Prejudice', 'Jane Austen', 6.99, 50),
('Letting Go', 'Jane Austen', 9.99, 75),
('The Catcher in the Rye', 'J.D. Salinger', 5.99, 120),
('The Hobbit', 'J.R.R. Tolkien', 12.99, 80),
('Harry Potter and the Sorcerer\'s Stone', 'J.K. Rowling', 15.99, 300),
('The Lord of the Rings', 'J.R.R. Tolkien', 18.99, 60),
('The Chronicles of Narnia', 'C.S. Lewis', 11.99, 90);


INSERT INTO users (first_name, last_name, email, password) VALUES ('Shreyas', 'Jadhav','shreyas@gmail.com', 'sj');