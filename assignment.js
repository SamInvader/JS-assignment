class Book {
    constructor(title, author, year, available = true) {
        this.title = title;
        this.author = author;
        this.year = year;
        this.available = available;
    }
}

class Library {
    constructor() {
        this.books = [];
    }

    addBook(book) {
        this.books.push(book);
    }

    borrowBook(index) {
        const book = this.books[index];
        if (book && book.available) {
            book.available = false;
            return true;
        }
        return false;
    }

    returnBook(index) {
        const book = this.books[index];
        if (book && !book.available) {
            book.available = true;
            return true;
        }
        return false;
    }

    listAvailableBooks() {
        return this.books.filter(book => book.available);
    }
}

const library = new Library();
const cart = {
    items: [],
    products: [
        { id: 1, name: 'Wireless Headphones', price: 12000 },
        { id: 2, name: 'Smart Watch', price: 9500 },
        { id: 3, name: 'Bluetooth Speaker', price: 6800 },
        { id: 4, name: 'Portable Charger', price: 4500 },
        { id: 5, name: 'Laptop Stand', price: 7600 }
    ]
};

const quizQuestions = [
    {
        question: 'Which HTML tag is used to define a JavaScript section?',
        options: ['<script>', '<js>', '<javascript>', '<code>'],
        answer: 0
    },
    {
        question: 'What method converts a JSON string into a JavaScript object?',
        options: ['JSON.stringify()', 'JSON.parse()', 'JSON.toObject()', 'JSON.load()'],
        answer: 1
    },
    {
        question: 'Which operator is used for strict equality in JavaScript?',
        options: ['=', '==', '===', '!=='],
        answer: 2
    },
    {
        question: 'Which CSS property changes the background color?',
        options: ['color', 'background-color', 'font-size', 'margin'],
        answer: 1
    }
];

const schoolData = '{"classA":[ {"name":"Amara", "CSC101":72, "CSC102":55, "CSC103":68}, {"name":"Chidi", "CSC101":40, "CSC102":48, "CSC103":35}, {"name":"Ngozi", "CSC101":85, "CSC102":90, "CSC103":78}, {"name":"Emeka", "CSC101":60, "CSC102":52, "CSC103":44}], "classB":[ {"name":"Fatima", "CSC101":91, "CSC102":88, "CSC103":95}, {"name":"Tunde", "CSC101":30, "CSC102":45, "CSC103":50}, {"name":"Blessing","CSC101":77, "CSC102":63, "CSC103":70}, {"name":"Seun", "CSC101":55, "CSC102":49, "CSC103":58}]}';

const validator = {
    username: /^[a-zA-Z0-9]{5,15}$/, 
    password: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]).{8,}$/, 
    phone: /^\+234\d{10}$/
};

let currentQuizIndex = 0;
let quizScore = 0;

function renderLibrary() {
    const allBooksContainer = document.getElementById('libraryAllBooks');
    const availableBooksContainer = document.getElementById('libraryAvailableBooks');
    allBooksContainer.innerHTML = '';
    availableBooksContainer.innerHTML = '';

    if (library.books.length === 0) {
        allBooksContainer.innerHTML = '<p>No books in the library yet.</p>';
    } else {
        const list = document.createElement('div');
        library.books.forEach((book, index) => {
            const bookRow = document.createElement('div');
            bookRow.className = 'product';
            bookRow.innerHTML = `
                <div>
                    <strong>${book.title}</strong> by ${book.author} (${book.year})
                    <div>Status: ${book.available ? 'Available' : 'Borrowed'}</div>
                </div>
            `;
            const actionButton = document.createElement('button');
            actionButton.textContent = book.available ? 'Borrow' : 'Return';
            actionButton.className = book.available ? '' : 'secondary';
            actionButton.addEventListener('click', () => {
                const okay = book.available ? library.borrowBook(index) : library.returnBook(index);
                document.getElementById('libraryMessage').textContent = okay
                    ? `Book ${book.available ? 'borrowed' : 'returned'} successfully.`
                    : 'Action could not be completed.';
                renderLibrary();
            });
            bookRow.appendChild(actionButton);
            list.appendChild(bookRow);
        });
        allBooksContainer.appendChild(list);
    }

    const availableBooks = library.listAvailableBooks();
    if (availableBooks.length === 0) {
        availableBooksContainer.innerHTML = '<p><strong>Available books:</strong> none at the moment.</p>';
    } else {
        const availableList = document.createElement('ul');
        availableBooks.forEach(book => {
            const item = document.createElement('li');
            item.textContent = `${book.title} by ${book.author} (${book.year})`;
            availableList.appendChild(item);
        });
        availableBooksContainer.innerHTML = '<strong>Available books:</strong>';
        availableBooksContainer.appendChild(availableList);
    }
}

function addLibraryBook(event) {
    event.preventDefault();
    const title = document.getElementById('bookTitle').value.trim();
    const author = document.getElementById('bookAuthor').value.trim();
    const yearValue = document.getElementById('bookYear').value.trim();
    const message = document.getElementById('libraryMessage');

    if (!title || !author || !yearValue) {
        message.textContent = 'Please enter a title, author, and year.';
        message.className = 'feedback invalid';
        return;
    }

    const year = parseInt(yearValue, 10);
    if (Number.isNaN(year) || year < 1000 || year > 2100) {
        message.textContent = 'Enter a valid year between 1000 and 2100.';
        message.className = 'feedback invalid';
        return;
    }

    const book = new Book(title, author, year, true);
    library.addBook(book);
    document.getElementById('bookTitle').value = '';
    document.getElementById('bookAuthor').value = '';
    document.getElementById('bookYear').value = '';
    message.textContent = 'Book added successfully.';
    message.className = 'feedback valid';
    renderLibrary();
}

function renderProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    cart.products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product';
        productCard.innerHTML = `
            <div>
                <strong>${product.name}</strong><br />₦${product.price.toFixed(2)}
            </div>
        `;
        const addButton = document.createElement('button');
        addButton.textContent = 'Add to Cart';
        addButton.addEventListener('click', () => {
            cart.items.push(product);
            renderCart();
        });
        productCard.appendChild(addButton);
        productList.appendChild(productCard);
    });
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    cartItems.innerHTML = '';

    if (cart.items.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.items.forEach((item, index) => {
            const cartRow = document.createElement('div');
            cartRow.className = 'cart-item';
            cartRow.innerHTML = `
                <div>${item.name}</div>
                <div>₦${item.price.toFixed(2)}</div>
            `;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.className = 'danger';
            removeButton.addEventListener('click', () => {
                cart.items.splice(index, 1);
                renderCart();
            });
            cartRow.appendChild(removeButton);
            cartItems.appendChild(cartRow);
        });
    }

    const total = cart.items.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = total.toFixed(2);
}

function renderQuizQuestion() {
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = '';

    if (currentQuizIndex >= quizQuestions.length) {
        const scorePercent = Math.round((quizScore / quizQuestions.length) * 100);
        const remark = getQuizRemark(scorePercent);
        quizContainer.innerHTML = `
            <p><strong>Quiz complete!</strong></p>
            <p>Your score: ${quizScore} / ${quizQuestions.length}</p>
            <p>Grade: ${scorePercent}% - ${remark}</p>
            <button id="restartQuiz">Restart Quiz</button>
        `;
        document.getElementById('restartQuiz').addEventListener('click', () => {
            currentQuizIndex = 0;
            quizScore = 0;
            renderQuizQuestion();
        });
        return;
    }

    const question = quizQuestions[currentQuizIndex];
    const questionTitle = document.createElement('p');
    questionTitle.innerHTML = `<strong>Question ${currentQuizIndex + 1}:</strong> ${question.question}`;
    quizContainer.appendChild(questionTitle);

    question.options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.className = 'quiz-option';
        optionButton.textContent = option;
        optionButton.addEventListener('click', () => handleQuizAnswer(optionButton, index));
        quizContainer.appendChild(optionButton);
    });
}

function handleQuizAnswer(button, selectedIndex) {
    const question = quizQuestions[currentQuizIndex];
    const isCorrect = selectedIndex === question.answer;
    if (isCorrect) {
        quizScore += 1;
        button.classList.add('correct');
    } else {
        button.classList.add('wrong');
        const options = document.querySelectorAll('.quiz-option');
        options[question.answer].classList.add('correct');
    }
    disableQuizOptions();
    setTimeout(() => {
        currentQuizIndex += 1;
        renderQuizQuestion();
    }, 800);
}

function disableQuizOptions() {
    document.querySelectorAll('.quiz-option').forEach(button => {
        button.disabled = true;
        button.style.cursor = 'default';
    });
}

function getQuizRemark(percent) {
    if (percent >= 90) return 'Excellent';
    if (percent >= 70) return 'Very good';
    if (percent >= 50) return 'Good';
    return 'Needs improvement';
}

function renderStudentTable() {
    const container = document.getElementById('studentTableContainer');
    const parsedData = JSON.parse(schoolData);
    const students = [...parsedData.classA, ...parsedData.classB];
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Name</th>
                <th>Average</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    students.forEach(student => {
        const average = ((student.CSC101 + student.CSC102 + student.CSC103) / 3).toFixed(2);
        const passed = average >= 50;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${average}</td>
            <td class="${passed ? 'status-pass' : 'status-fail'}">${passed ? 'Pass' : 'Fail'}</td>
        `;
        table.querySelector('tbody').appendChild(row);
    });

    container.innerHTML = '';
    container.appendChild(table);
}

function validateField(input, regex, successMessage, errorMessage, feedbackId) {
    const value = input.value.trim();
    const feedback = document.getElementById(feedbackId);
    if (value === '') {
        feedback.textContent = '';
        feedback.className = 'feedback';
        return false;
    }
    const valid = regex.test(value);
    feedback.textContent = valid ? successMessage : errorMessage;
    feedback.className = `feedback ${valid ? 'valid' : 'invalid'}`;
    return valid;
}

function initRegistrationForm() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const phoneInput = document.getElementById('phone');
    const registrationResult = document.getElementById('registrationResult');
    const form = document.getElementById('registrationForm');

    usernameInput.addEventListener('input', () => {
        validateField(usernameInput, validator.username, 'Valid username.', 'Username must be alphanumeric and 5–15 characters.', 'usernameFeedback');
    });
    passwordInput.addEventListener('input', () => {
        validateField(passwordInput, validator.password, 'Strong password.', 'Password needs 8+ chars, one uppercase, one digit and one special symbol.', 'passwordFeedback');
    });
    phoneInput.addEventListener('input', () => {
        validateField(phoneInput, validator.phone, 'Valid Nigerian number.', 'Phone must be +234 followed by 10 digits.', 'phoneFeedback');
    });

    form.addEventListener('submit', event => {
        event.preventDefault();
        const usernameValid = validateField(usernameInput, validator.username, '', '', 'usernameFeedback');
        const passwordValid = validateField(passwordInput, validator.password, '', '', 'passwordFeedback');
        const phoneValid = validateField(phoneInput, validator.phone, '', '', 'phoneFeedback');

        if (usernameValid && passwordValid && phoneValid) {
            registrationResult.textContent = 'Registration data looks good!';
            registrationResult.className = 'feedback valid';
        } else {
            registrationResult.textContent = 'Please fix the highlighted fields before submitting.';
            registrationResult.className = 'feedback invalid';
        }
    });
}

function initializePage() {
    document.getElementById('addBookButton').addEventListener('click', addLibraryBook);
    renderLibrary();
    renderProducts();
    renderCart();
    renderQuizQuestion();
    renderStudentTable();
    initRegistrationForm();
}

window.addEventListener('DOMContentLoaded', initializePage);
