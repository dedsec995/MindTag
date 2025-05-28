import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { getBookById, getBookPages, addPageToBook, updateBookPage, deleteBook } from '../services/api';
import Page from '../components/Page';
import BookPagination from '../components/BookPagination';

const DetailsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f0f2f5;
    min-height: 100vh;
    box-sizing: border-box; 
`;

const BookTitle = styled.h1`
    color: #333;
    margin-bottom: 30px;
    text-align: center;
`;

const BOOK_VIEW_HEIGHT = 720; // This value still holds and should be good

const BookView = styled.div`
    position: relative; 
    width: 100%;
    max-width: 750px; 
    height: ${BOOK_VIEW_HEIGHT}px; /* This ensures the page is contained */
    display: flex;
    justify-content: center;
    align-items: center;
    perspective: 1200px;
    margin-bottom: 20px; 
    background-color: #e8e8e8; /* Keep for debugging, remove later */
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
`;

const ActionsContainer = styled.div`
    margin-top: 15px;
    margin-bottom: 20px;
    display: flex;
    gap: 15px;
`;

const ActionButton = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s ease;

    ${props => props.back && `
        background-color: #6c757d;
        color: white;
        &:hover {
            background-color: #5a6268;
        }
    `}
    ${props => props.delete && `
        background-color: #dc3545;
        color: white;
        &:hover {
            background-color: #c82333;
        }
    `}
`;

const BookDetailsPage = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [pages, setPages] = useState([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const debounceTimeoutRef = useRef(null);

    const fetchBookAndPages = async () => {
        setLoading(true);
        setError(null);
        try {
            const bookData = await getBookById(bookId);
            setBook(bookData);
            const pagesData = await getBookPages(bookId);
            
            const sortedPages = pagesData.sort((a, b) => {
                if (a.page_number !== b.page_number) {
                    return a.page_number - b.page_number;
                }
                return a.page_id.localeCompare(b.page_id);
            });
            setPages(sortedPages);
            
            if (sortedPages.length > 0) {
                if (currentPageIndex >= sortedPages.length) {
                    setCurrentPageIndex(sortedPages.length - 1);
                } 
            } else {
                setCurrentPageIndex(0);
            }
        } catch (err) {
            setError("Failed to load book: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookAndPages();
    }, [bookId]); 

    const handlePreviousPage = () => {
        setCurrentPageIndex((prevIndex) => Math.max(0, prevIndex - 1));
    };

    const handleNextPage = () => {
        setCurrentPageIndex((prevIndex) => Math.min(pages.length - 1, prevIndex + 1));
    };

    const handleAddPage = async () => {
        try {
            const maxPageNumber = pages.reduce((max, p) => Math.max(max, p.page_number || 0), 0);
            const newPageContent = {
                content: "Start writing on this new page...",
                page_number: maxPageNumber + 1 
            };
            const result = await addPageToBook(bookId, newPageContent);
            if (result && result.page) {
                const updatedPages = [...pages, result.page].sort((a, b) => a.page_number - b.page_number);
                setPages(updatedPages);
                setCurrentPageIndex(updatedPages.findIndex(p => p.page_id === result.page.page_id)); 
            }
        } catch (err) {
            setError("Failed to add new page: " + err.message);
        }
    };

    const handleContentChange = useCallback((page_id, newContent) => {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = setTimeout(async () => {
            try {
                await updateBookPage(bookId, page_id, { content: newContent });
                setPages(prevPages => 
                    prevPages.map(p => p.page_id === page_id ? { ...p, content: newContent } : p)
                );
            } catch (err) {
                console.error("Failed to update page content:", err);
                setError("Failed to save page content: " + err.message);
            }
        }, 1000); 
    }, [bookId]);

    const handleDeleteBook = async () => {
        if (window.confirm("Are you sure you want to delete this book and all its pages?")) {
            try {
                await deleteBook(bookId);
                navigate('/');
            } catch (err) {
                setError("Failed to delete book: " + err.message);
            }
        }
    };

    if (loading) return <DetailsContainer>Loading book...</DetailsContainer>;
    if (error) return <DetailsContainer>Error: {error}</DetailsContainer>;
    if (!book) return <DetailsContainer>Book not found.</DetailsContainer>;

    const currentPage = pages[currentPageIndex];
    const totalPages = pages.length;

    return (
        <DetailsContainer>
            <BookTitle>{book.title}</BookTitle>
            <BookView>
                <AnimatePresence initial={false} mode='wait'>
                    {currentPage ? (
                        <Page 
                            key={currentPage.page_id} 
                            page={currentPage} 
                            onContentChange={handleContentChange}
                            active={true}
                            zIndex={2} 
                        />
                    ) : (
                        <Page 
                            key="empty-page" 
                            page={{ page_id: "empty", content: "This book has no pages yet. Click 'Add New Page' to start writing!", page_number: 0 }} 
                            active={false} 
                            zIndex={1} 
                        />
                    )}
                </AnimatePresence>
            </BookView>
            <BookPagination
                currentPage={currentPage ? currentPage.page_number : 0}
                totalPages={totalPages}
                onPrevious={handlePreviousPage}
                onNext={handleNextPage}
                onAddPage={handleAddPage}
            />
            <ActionsContainer>
                <ActionButton back onClick={() => navigate('/')}>Back to Books</ActionButton>
                <ActionButton delete onClick={handleDeleteBook}>Delete Book</ActionButton>
            </ActionsContainer>
        </DetailsContainer>
    );
};

export default BookDetailsPage;