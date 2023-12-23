# Simple REST API for Authentication & Authorization

This is a simple REST API designed for user authentication and authorization. It uses MongoDB for the database, Node.js with Express.js for the backend, JWT for secure authentication, and Redis for storing and blacklisting JWT refresh tokens.


## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/pparthiv/Auth-REST_API.git
   ```
2. Install dependencies
    ```bash
    npm install
    ```
3. Set up environment variables
    * PORT
    * MONGODB_URI
    * DB_NAME
    * ACCESS_TOKEN_SECRET
    * REFRESH_TOKEN_SECRET
4. Start the server
    ```bash
    npm start
    ```

## Endpoints
    * POST /auth/register
    * POST /auth/login
    * POST /auth/refresh-token
    * DELETE /auth/logout