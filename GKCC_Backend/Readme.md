### Steps to View This File in VSCode:

1. Install the **"README Preview"** extension.
2. Press `Ctrl+Shift+P` to open the Command Palette.
3. Search for **"README"** in the Command Palette.
4. Press `Enter` to select and view the README file.

## Project Documentation: GKCC Backend

### Overview
This project represents the backend system for the Global Kokani Committees' Council (GKCC). It facilitates interaction and management across multiple community organizations, such as KWS. The backend is built with Node.js, Express, and MongoDB, and uses a modular architecture for scalability and maintainability.

Developers:- Juned Khan,Sanad Naqvi


### Project Structure
The project follows a clean and organized structure:

```
.gkcc_backend
├── .vscode
├── node_modules
├── Public
├── src
│   ├── controllers
│   ├── db
│   ├── middlewares
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── app.js
│   ├── constants.js
│   └── index.js
├── .env
├── needtomakelog_limiter
├── package.json
├── package-lock.json
```

#### Key Folders and Files
1. **Controllers**: Handles the logic for various routes. For instance, `admin.controller.js` contains admin-specific business logic.
2. **DB**: Manages database connectivity and configurations.
3. **Middlewares**: Provides reusable middleware functions like authentication and file handling.
4. **Models**: Defines the schema and data structure for MongoDB collections using Mongoose.
5. **Routes**: Defines API endpoints and associates them with respective controllers.
6. **Services**: Provides utility functions for tasks such as third-party API integration.
7. **Utils**: Includes helper functions and error-handling mechanisms.
8. **app.js**: Initializes middleware and APIs.
9. **constants.js**: Stores constants used throughout the application.
10. **index.js**: Entry point for the application.

---

### Dependencies
The project uses the following dependencies:

| Dependency      | Version | Purpose                                   |
|-----------------|---------|-------------------------------------------|
| bcrypt          | ^5.1.1  | Password hashing                         |
| body-parser     | ^1.20.3 | Parsing request bodies                   |
| bullmq          | ^5.21.1 | Queue management for jobs                |
| cloudinary      | ^2.5.1  | Cloud storage for media files            |
| cors            | ^2.8.5  | Enabling CORS                            |
| dotenv          | ^16.4.5 | Environment variable management          |
| express         | ^4.21.0 | Web framework                            |
| fs              | ^0.0.1  | File system module                       |
| jsonwebtoken    | ^9.0.2  | Token-based authentication               |
| mongodb         | ^6.9.0  | MongoDB driver                           |
| mongoose        | ^8.7.0  | MongoDB ORM                              |
| multer          | ^1.4.5  | File upload handling                     |
| node-netstat    | ^1.9.0  | Monitor network connections              |
| nodemailer      | ^6.9.15 | Email sending                            |
| xlsx            | ^0.18.5 | Excel file parsing and generation        |

---

### Scripts
The project includes the following scripts in `package.json`:

| Script | Command                                                                 | Description                         |
|--------|-------------------------------------------------------------------------|-------------------------------------|
| start  | `node -r dotenv/config --experimental-json-modules src/index.js`       | Start the production server         |
| dev    | `nodemon -r dotenv/config --experimental-json-modules src/index.js`    | Start the development server        |

---

### Folder Details

#### 1. **Controllers**
Handles request logic:
- **admin.controller.js**: Admin-specific operations.
- **advert.controller.js**: Handles advertisement management.
- **association.controller.js**: Manages associations and their data.
- **membership.controller.js**: Membership management logic.

#### 2. **DB**
Manages database initialization and Mongoose schemas:
- Connects to MongoDB using `mongoose.connect()`.

#### 3. **Middlewares**
Reusable middleware components:
- **adminauth.middleware.js**: Authentication for admin routes.
- **auth.middleware.js**: General authentication middleware.
- **multer.middleware.js**: Handles file uploads.

#### 4. **Models**
Defines the data schema for MongoDB:
- **admin.model.js**: Schema for admin data.
- **advert.model.js**: Advertisement data structure.
- **membership.model.js**: Membership schema.

#### 5. **Routes**
Defines API routes:
- **admin.router.js**: Admin-related endpoints.
- **advert.router.js**: Routes for managing advertisements.
- **membership.router.js**: Membership endpoints.

#### 6. **Services**
Utility services for the application. For example, integrating third-party APIs like Cloudinary or sending emails.

#### 7. **Utils**
Helper functions:
- **ApiError.js**: Custom error-handling class. Example:
  ```javascript
  class ApiError extends Error {
      constructor(statusCode, message = "something went wrong", errors = [], stack = "") {
          super(message);
          this.statusCode = statusCode;
          this.data = null;
          this.message = message;
          this.success = false;
          this.errors = errors;

          if (stack) {
              this.stack = stack;
          } else {
              Error.captureStackTrace(this, this.constructor);
          }
      }
  }

  export { ApiError };
  ```
- **ApiResponse.js**: Custom response wrapper class. Example:
  ```javascript
  class ApiResponse {
      constructor(statusCode, data, message = "Success") {
          this.statusCode = statusCode;
          this.data = data;
          this.message = message;
          this.success = statusCode < 400;
      }
  }

  export { ApiResponse };
  ```
- **asynchandler.js**: Middleware to handle async requests. Example:
  ```javascript
  const asyncHandler = (requestHandler) => {
      return (req, res, next) => {
          Promise.resolve(requestHandler(req, res, next))
              .catch((err) => next(err));
      };
  };

  export { asyncHandler };
  ```
- **cloudinary.js**: Cloudinary integration helper.
- **limiter.js**: Rate limiting helper for APIs.

---

### How to Run the Project

1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the `.env` file with required variables such as:
   ```env
   # Testing keys
   MONGO_URI=
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=-691sPo

   # GKCC official keys
   MONGO_URI=
   CLOUDINARY_CLOUD_NAME=dctmzawgj
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=

   # Token secret
   JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

   # Ports
   port=5001

   # CORS
   CORS_ORIGIN=*

   # Mail credentials for bulk upload (GKCC mail credentials)
   MAIL_CREDENTIALS_USER=junedkhanfarh@gmail.com
   MAIL_CREDENTIALS_PASS=
   ```

   **Note:** Use the testing keys for development and personal use only.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the APIs via `http://localhost:3000/`.

---

### Example Usage
#### Admin Login API
**Endpoint:** `/api/admin/login`
**Method:** `POST`
**Description:** Logs in an admin.

**Example Implementation:**
```javascript
const loginAdmin = asyncHandler(async (req, res) => {
  const { GKCCId, password } = req.body;

  // Check if the admin exists in the database by GKCCId
  const admin = await Admin.findOne({ GKCCId });

  if (admin && (await admin.comparePassword(password))) {
    // Password matches, generate a token
    const token = generateToken(admin._id);

    return res.json(
      new ApiResponse(200, {
        admin: {
          _id: admin._id,
          GKCCId: admin.GKCCId,
          position: admin.position,
          associationName: admin.association,
          country: admin.country,
          city: admin.city,
        },
        token,
      }, "Admin logged in successfully")
    );
  } else {
    throw new ApiError(
      401,
      "Invalid GKCCId or password",
      "Please check your credentials and try again."
    );
  }
});
```

---

### Future Improvements
1. Add test cases using a testing library like Jest.
2. Implement Swagger for detailed API documentation.
3. Add proper logging using Winston or Morgan.
4. Enhance error handling.
5. Integrate role-based access control (RBAC).

---

This documentation provides an overview of the backend system and its functionality to help developers quickly understand and contribute to the project.
