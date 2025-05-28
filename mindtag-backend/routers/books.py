from fastapi import APIRouter, HTTPException, status
from bson import ObjectId # For MongoDB's ObjectId
from database import get_database

router = APIRouter(prefix="/books", tags=["books"])

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_book(book: dict):
    """
    Create a new book.
    Expected 'book' dictionary keys: 'title', 'thumbnail' (optional)
    """
    if not book.get("title"):
        raise HTTPException(status_code=400, detail="Book title is required.")

    db = get_database()
    books_collection = db["books"]
    
    new_book = {
        "title": book["title"],
        "thumbnail": book.get("thumbnail", ""), # Default empty string if no thumbnail
        "pages": [] # Each book starts with no pages
    }
    
    result = await books_collection.insert_one(new_book)
    created_book = await books_collection.find_one({"_id": result.inserted_id})
    
    # Convert ObjectId to string for JSON serialization
    if created_book:
        created_book["_id"] = str(created_book["_id"])
    
    return created_book

@router.get("/")
async def get_all_books():
    """
    Retrieve all books.
    """
    db = get_database()
    books_collection = db["books"]
    
    books = []
    async for book in books_collection.find({}):
        book["_id"] = str(book["_id"]) # Convert ObjectId to string
        books.append(book)
    return books

@router.get("/{book_id}")
async def get_book(book_id: str):
    """
    Retrieve a single book by ID.
    """
    db = get_database()
    books_collection = db["books"]
    
    try:
        book = await books_collection.find_one({"_id": ObjectId(book_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid book ID format.")

    if not book:
        raise HTTPException(status_code=404, detail="Book not found.")
    
    book["_id"] = str(book["_id"])
    return book

@router.put("/{book_id}")
async def update_book(book_id: str, book_update: dict):
    """
    Update an existing book.
    Allowed 'book_update' dictionary keys: 'title', 'thumbnail'
    """
    db = get_database()
    books_collection = db["books"]
    
    try:
        object_id = ObjectId(book_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid book ID format.")
    
    update_data = {}
    if "title" in book_update:
        update_data["title"] = book_update["title"]
    if "thumbnail" in book_update:
        update_data["thumbnail"] = book_update["thumbnail"]

    if not update_data:
        raise HTTPException(status_code=400, detail="No valid fields to update.")
        
    result = await books_collection.update_one(
        {"_id": object_id},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Book not found.")
    
    updated_book = await books_collection.find_one({"_id": object_id})
    updated_book["_id"] = str(updated_book["_id"])
    return updated_book

@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book(book_id: str):
    """
    Delete a book by ID.
    """
    db = get_database()
    books_collection = db["books"]
    
    try:
        object_id = ObjectId(book_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid book ID format.")

    result = await books_collection.delete_one({"_id": object_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Book not found.")
    
    return {"message": "Book deleted successfully."}