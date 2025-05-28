import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import BookCard from '../components/BookCard';
import AddBookButton from '../components/AddBookButton';
import { getBooks, createBook } from '../services/api';

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    min-height: 100vh;
    background-color: #f0f2f5;
`;

const Header = styled.h1`
    color: #333;
    margin-bottom: 30px;
`;

const BooksGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); /* Responsive grid */
    gap: 30px;
    justify-content: center;
    width: 100%;
    max-width: 1200px; /* Limit grid width */
`;

const AddBookSection = styled.div`
    margin-top: 40px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    width: 100%;
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    width: 400px;
    max-width: 90%;
`;

const ModalTitle = styled.h2`
    margin-top: 0;
    color: #333;
    text-align: center;
`;

const InputGroup = styled.div`
    margin-bottom: 15px;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1em;
`;

const ModalButtons = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
`;

const ModalButton = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s ease;

    ${props => props.primary && `
        background-color: #007bff;
        color: white;
        &:hover {
            background-color: #0056b3;
        }
    `}

    ${props => props.secondary && `
        background-color: #6c757d;
        color: white;
        &:hover {
            background-color: #5a6268;
        }
    `}
`;

const HomePage = () => {
    const [books, setBooks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newBookTitle, setNewBookTitle] = useState('');
    const [newBookThumbnail, setNewBookThumbnail] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBooks = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getBooks();
            setBooks(data);
        } catch (err) {
            setError("Failed to fetch books: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleAddBook = async () => {
        if (!newBookTitle.trim()) {
            alert("Book title cannot be empty!");
            return;
        }
        try {
            await createBook({ title: newBookTitle, thumbnail: newBookThumbnail });
            setNewBookTitle('');
            setNewBookThumbnail('');
            setShowModal(false);
            fetchBooks(); // Refresh the list of books
        } catch (err) {
            setError("Failed to create book: " + err.message);
        }
    };

    if (loading) return <PageContainer>Loading books...</PageContainer>;
    if (error) return <PageContainer>Error: {error}</PageContainer>;

    return (
        <PageContainer>
            <Header>MindTag: Ditigal NoteBooks</Header>
            <AddBookSection>
                <AddBookButton onClick={() => setShowModal(true)} />
            </AddBookSection>
            <BooksGrid>
                {books.map((book) => (
                    <BookCard key={book._id} book={book} />
                ))}
            </BooksGrid>

            {showModal && (
                <ModalOverlay>
                    <ModalContent>
                        <ModalTitle>Create New Book</ModalTitle>
                        <InputGroup>
                            <Label htmlFor="bookTitle">Title:</Label>
                            <Input
                                id="bookTitle"
                                type="text"
                                value={newBookTitle}
                                onChange={(e) => setNewBookTitle(e.target.value)}
                                placeholder="Enter book title"
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label htmlFor="bookThumbnail">Thumbnail URL (Optional):</Label>
                            <Input
                                id="bookThumbnail"
                                type="text"
                                value={newBookThumbnail}
                                onChange={(e) => setNewBookThumbnail(e.target.value)}
                                placeholder="Enter thumbnail URL"
                            />
                        </InputGroup>
                        <ModalButtons>
                            <ModalButton secondary onClick={() => setShowModal(false)}>Cancel</ModalButton>
                            <ModalButton primary onClick={handleAddBook}>Create</ModalButton>
                        </ModalButtons>
                    </ModalContent>
                </ModalOverlay>
            )}
        </PageContainer>
    );
};

export default HomePage;