#  Backend (Django) — Simple ML

This is a lightweight Django backend for the Pixel-Perfect project (real-estate analysis chatbot style).
It implements:

- `/api/analyze/` POST — estimate property price (area, bedrooms, location_factor)
- `/api/chat/` POST — simple rule-based chatbot
- Query history saved to a SQLite database (`db.sqlite3`) via `QueryHistory` model

## Quickstart

1. Create a virtualenv and activate it.
2. Install requirements:
   ```
   pip install -r requirements.txt
   ```
3. Run migrations:
   ```
   python manage.py migrate
   ```
4. Run the dev server:
   ```
   python manage.py runserver 8000
   ```

## Example analyze request (fetch):
```
POST http://localhost:8000/api/analyze/
Content-Type: application/json

{
  "area": 1200,
  "bedrooms": 2,
  "location_factor": 1.5
}
```
