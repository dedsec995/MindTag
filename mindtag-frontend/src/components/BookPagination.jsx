import React from 'react';
import styled from 'styled-components';

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const PaginationButton = styled.button`
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0056b3;
    }

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
`;

const PageInfo = styled.span`
    font-size: 1.1em;
    color: #555;
    display: flex;
    align-items: center;
`;

const BookPagination = ({ currentPage, totalPages, onPrevious, onNext, onAddPage }) => {
    return (
        <PaginationContainer>
            <PaginationButton onClick={onPrevious} disabled={currentPage <= 1}>
                Previous Page
            </PaginationButton>
            <PageInfo>
                Page {currentPage} of {totalPages}
            </PageInfo>
            <PaginationButton onClick={onNext} disabled={currentPage >= totalPages}>
                Next Page
            </PaginationButton>
            <PaginationButton onClick={onAddPage} style={{backgroundColor: '#28a745'}}>
                Add New Page
            </PaginationButton>
        </PaginationContainer>
    );
};

export default BookPagination;