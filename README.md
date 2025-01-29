## Setup Instructions
Follow these steps to set up the project locally:

1. Clone the repository
### Backend
1. Navigate to the backend: 
    ```bash
    cd materials-web/flask_app
    ```
2. Create and activate a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate 
    ```
3. Install dependencies:    
    ```bash
    pip install -r requirements.txt
    ```
4. Create a folder called `data` and populate with data. For this app, there will need to be subfolders `texture_img`, `texture_depth`, `context_img`, and `label`.
5. Run the Flask server
    ```bash
    python app.py
    ```
The server will be running at http://127.0.0.1:5000.

### Frontend
### Backend
1. Navigate to the frontend: 
    ```bash
    cd materials-web/frontend
    ```
2. Install dependencies:
    ```bash
    npm install --force
    ```
3. Start the React development server:
    ```bash
    npm start
    ```
The frontend will be available at http://localhost:3000.

