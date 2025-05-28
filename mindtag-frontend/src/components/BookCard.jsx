import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const CardContainer = styled(Link)`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f8f8f8;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    margin: 15px;
    text-decoration: none;
    color: #333;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    width: 200px;
    height: 280px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
`;

const Thumbnail = styled.img`
    width: 150px;
    height: 200px;
    object-fit: cover;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
`;

const BookTitle = styled.h3`
    font-size: 1.1em;
    margin: 0;
    text-align: center;
    word-break: break-word; /* Prevents long words from overflowing */
`;

const BookCard = ({ book }) => {
    const defaultThumbnail = 'https://via.placeholder.com/150x200?text=No+Thumbnail'; // Placeholder image

    return (
        <CardContainer to={`/book/${book._id}`}>
            <Thumbnail src={book.thumbnail || defaultThumbnail} alt={book.title} />
            <BookTitle>{book.title}</BookTitle>
        </CardContainer>
    );
};

export default BookCard;