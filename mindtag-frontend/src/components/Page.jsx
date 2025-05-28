import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Calculate the height needed for 22 lines + top/bottom padding
const LINE_HEIGHT = 28; // pixels for each line of text
const NUM_LINES = 22;
const PAGE_VERTICAL_PADDING = 20; // top + bottom padding for the page itself
const LEFT_RED_LINE_MARGIN = 6; // Padding for the red line

// Total height for content area based on lines
const CONTENT_HEIGHT_FOR_LINES = NUM_LINES * LINE_HEIGHT;
// Total page height including padding
const CALCULATED_PAGE_HEIGHT = CONTENT_HEIGHT_FOR_LINES + (PAGE_VERTICAL_PADDING * 2);


const PageContainer = styled(motion.div)`
    background-color: #fefefe; /* Page color */
    border: 1px solid #e0e0e0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: absolute; /* Essential for overlaying pages for animation */
    width: 90%;
    max-width: 700px; /* Adjust as needed for book size */
    height: ${CALCULATED_PAGE_HEIGHT}px; /* Fixed height based on lines */
    padding: ${PAGE_VERTICAL_PADDING}px 40px;
    overflow-y: auto; /* Allow scrolling if content overflows */
    
    /* Remove 'left: 50%; top: 50%; transform: translate(-50%, -50%);' from here! */
    /* Framer Motion will manage the transform property now. */

    display: flex;
    flex-direction: column;
    font-family: 'Georgia', serif; /* Classic book font */
    color: #333;
    z-index: ${props => props.zIndex || 1}; /* Manage layer order for animation */
    pointer-events: ${props => props.active ? 'auto' : 'none'}; /* Only active page is interactive */
    
    line-height: ${LINE_HEIGHT}px; 

    /* Traditional book lining */
    background-image:
        repeating-linear-gradient(
            to bottom,
            transparent,
            transparent ${LINE_HEIGHT - 1}px, /* Space for text */
            #e0e0e0 ${LINE_HEIGHT}px      /* Line color and thickness */
        );
    background-size: 100% ${LINE_HEIGHT}px; /* Control spacing of lines */
    background-position: 0px ${PAGE_VERTICAL_PADDING}px; 
`;

const ContentEditable = styled.div`
    flex-grow: 1; 
    font-size: 1.1em;
    line-height: ${LINE_HEIGHT}px; 
    outline: none; 
    white-space: pre-wrap; 
    caret-color: blue; 
    
    border-left: 2px solid #ffcccc; 
    padding-left: ${LEFT_RED_LINE_MARGIN}px; 
    margin-left: -${LEFT_RED_LINE_MARGIN}px; 

    overflow-y: auto; 
    height: 100%; 
    box-sizing: border-box; 

    text-align: left; /* ADD THIS LINE */

    & > * {
        margin: 0;
        padding: 0;
        line-height: inherit; 
    }

    &:focus {
        outline: none; 
    }
`;

const PageNumber = styled.div`
    position: absolute;
    bottom: 15px;
    right: 20px;
    font-size: 0.9em;
    color: #777;
`;

const pageVariants = {
    hidden: { 
        opacity: 0, 
        scale: 0.9, 
        rotateY: -90,
        x: '-50%', // Add x and y for centering
        y: '-50%' 
    },
    enter: { 
        opacity: 1, 
        scale: 1, 
        rotateY: 0, 
        x: '-50%', // Ensure x and y remain -50% in the entered state
        y: '-50%',
        transition: { duration: 0.8, ease: [0.2, 0.7, 0.3, 0.9] } 
    },
    exit: { 
        opacity: 0, 
        scale: 0.9, 
        rotateY: 90, 
        x: '-50%', // Also keep during exit to prevent jarring jumps
        y: '-50%',
        transition: { duration: 0.8, ease: [0.2, 0.7, 0.3, 0.9] } 
    },
};

const Page = ({ page, onContentChange, active, zIndex }) => {
    const contentEditableRef = useRef(null);
    const [internalContent, setInternalContent] = useState(page.content); 

    useEffect(() => {
        setInternalContent(page.content);
        if (contentEditableRef.current && contentEditableRef.current.innerText !== page.content) {
            contentEditableRef.current.innerText = page.content;
        }
    }, [page.content]);

    useEffect(() => {
        if (active && contentEditableRef.current) {
            contentEditableRef.current.focus();
            const range = document.createRange();
            const sel = window.getSelection();
            
            if (contentEditableRef.current.firstChild) {
                range.selectNodeContents(contentEditableRef.current);
                range.collapse(false); 
            } else {
                const textNode = document.createTextNode('');
                contentEditableRef.current.appendChild(textNode);
                range.setStart(textNode, 0);
                range.collapse(true);
            }
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }, [active]);

    const handleInput = useCallback((e) => {
        const newContent = e.currentTarget.innerText;
        setInternalContent(newContent); 
        if (onContentChange) {
            onContentChange(page.page_id, newContent); 
        }
    }, [onContentChange, page.page_id]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            
            range.deleteContents();
            range.insertNode(document.createTextNode('\n'));
            
            range.collapse(false); 
            selection.removeAllRanges();
            selection.addRange(range);
            
            const event = new Event('input', { bubbles: true });
            contentEditableRef.current.dispatchEvent(event);
        }
    }, []);

    return (
        <PageContainer 
            variants={pageVariants}
            initial={active ? "enter" : "hidden"} 
            animate={active ? "enter" : "exit"}   
            exit="exit"
            zIndex={zIndex}
            active={active}
            // Add these two properties for absolute positioning
            style={{
                left: '50%',
                top: '50%',
            }}
        >
            <ContentEditable
                ref={contentEditableRef}
                contentEditable={active}
                suppressContentEditableWarning={true}
                onBlur={handleInput} 
                onInput={handleInput} 
                onKeyDown={handleKeyDown} 
            />
            <PageNumber>Page {page.page_number}</PageNumber>
        </PageContainer>
    );
};

export default Page;