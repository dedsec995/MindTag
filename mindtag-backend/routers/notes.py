from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from database import get_database

router = APIRouter(prefix="/books/{book_id}/pages", tags=["pages"])

@router.post("/", status_code=status.HTTP_201_CREATED)
async def add_page_to_book(book_id: str, page: dict):
    """
    Add a new page to a specific book.
    Expected 'page' dictionary keys: 'content', 'page_number' (optional)
    """
    db = get_database()
    books_collection = db["books"]

    if not page.get("content"):
        raise HTTPException(status_code=400, detail="Page content is required.")

    try:
        object_id = ObjectId(book_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid book ID format.")

    # Find the book to determine the next page number
    book = await books_collection.find_one({"_id": object_id})
    if not book:
        raise HTTPException(status_code=404, detail="Book not found.")
    
    # Assign page_number if not provided, or ensure it's unique/sequential
    # For simplicity, let's just append and let the client handle ordering if needed
    # Or calculate next page number
    next_page_number = len(book.get("pages", [])) + 1
    
    new_page = {
        "page_id": str(ObjectId()), # Unique ID for the page within the book
        "content": page["content"],
        "page_number": page.get("page_number", next_page_number)
    }

    result = await books_collection.update_one(
        {"_id": object_id},
        {"$push": {"pages": new_page}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Book not found.")
    
    return {"message": "Page added successfully", "page": new_page}

@router.get("/")
async def get_book_pages(book_id: str):
    """
    Retrieve all pages for a specific book.
    """
    db = get_database()
    books_collection = db["books"]

    try:
        object_id = ObjectId(book_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid book ID format.")

    book = await books_collection.find_one({"_id": object_id}, {"pages": 1}) # Only fetch pages field

    if not book:
        raise HTTPException(status_code=404, detail="Book not found.")
    
    return book.get("pages", [])

@router.get("/{page_id}")
async def get_single_book_page(book_id: str, page_id: str):
    """
    Retrieve a single page from a book.
    """
    db = get_database()
    books_collection = db["books"]

    try:
        book_object_id = ObjectId(book_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid book ID format.")

    book = await books_collection.find_one(
        {"_id": book_object_id, "pages.page_id": page_id},
        {"pages.$": 1} # Project only the matching page
    )

    if not book or not book.get("pages"):
        raise HTTPException(status_code=404, detail="Book or Page not found.")
    
    return book["pages"][0]


@router.put("/{page_id}")
async def update_book_page(book_id: str, page_id: str, page_update: dict):
    """
    Update a specific page within a book.
    Allowed 'page_update' dictionary keys: 'content', 'page_number'
    """
    db = get_database()
    books_collection = db["books"]

    try:
        book_object_id = ObjectId(book_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid book ID format.")
    
    update_fields = {}
    if "content" in page_update:
        update_fields["pages.$.content"] = page_update["content"]
    if "page_number" in page_update:
        update_fields["pages.$.page_number"] = page_update["page_number"]

    if not update_fields:
        raise HTTPException(status_code=400, detail="No valid fields to update for the page.")

    result = await books_collection.update_one(
        {"_id": book_object_id, "pages.page_id": page_id},
        {"$set": update_fields}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Book or Page not found.")

    # Fetch the updated page to return it
    updated_book = await books_collection.find_one(
        {"_id": book_object_id, "pages.page_id": page_id},
        {"pages.$": 1}
    )
    return updated_book["pages"][0]


@router.delete("/{page_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book_page(book_id: str, page_id: str):
    """
    Delete a specific page from a book.
    """
    db = get_database()
    books_collection = db["books"]

    try:
        book_object_id = ObjectId(book_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid book ID format.")

    result = await books_collection.update_one(
        {"_id": book_object_id},
        {"$pull": {"pages": {"page_id": page_id}}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Book not found.")
    if result.modified_count == 0: # This means the page wasn't found in the book's pages array
        raise HTTPException(status_code=404, detail="Page not found in the specified book.")
    
    return {"message": "Page deleted successfully."}