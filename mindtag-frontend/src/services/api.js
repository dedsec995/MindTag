const API_BASE_URL = 'http://localhost:8000'; // Your FastAPI backend URL

// Generic fetch function for handling responses
async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Server error' }));
            throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
        }
        // Handle 204 No Content for DELETE operations
        if (response.status === 204) {
            return null; 
        }
        return await response.json();
    } catch (error) {
        console.error("API call failed:", error);
        throw error; // Re-throw to be caught by the component
    }
}

// --- Book API Calls ---

export const getBooks = async () => {
    return fetchData(`${API_BASE_URL}/books`);
};

export const createBook = async (bookData) => {
    return fetchData(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
    });
};

export const getBookById = async (bookId) => {
    return fetchData(`${API_BASE_URL}/books/${bookId}`);
};

export const updateBook = async (bookId, updateData) => {
    return fetchData(`${API_BASE_URL}/books/${bookId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
    });
};

export const deleteBook = async (bookId) => {
    return fetchData(`${API_BASE_URL}/books/${bookId}`, {
        method: 'DELETE',
    });
};

// --- Page API Calls ---

export const getBookPages = async (bookId) => {
    return fetchData(`${API_BASE_URL}/books/${bookId}/pages`);
};

export const addPageToBook = async (bookId, pageData) => {
    return fetchData(`${API_BASE_URL}/books/${bookId}/pages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData),
    });
};

export const updateBookPage = async (bookId, pageId, pageData) => {
    return fetchData(`${API_BASE_URL}/books/${bookId}/pages/${pageId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData),
    });
};

export const deleteBookPage = async (bookId, pageId) => {
    return fetchData(`${API_BASE_URL}/books/${bookId}/pages/${pageId}`, {
        method: 'DELETE',
    });
};