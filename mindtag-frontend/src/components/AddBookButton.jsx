import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 12px;
    transition: background-color 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    &:hover {
        background-color: #45a049;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
`;

const AddBookButton = ({ onClick }) => {
    return (
        <Button onClick={onClick}>
            Add New Book
        </Button>
    );
};

export default AddBookButton;