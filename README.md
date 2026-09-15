# Wanderlust

Wanderlust is a full-stack travel accommodation platform built with Node.js, Express, MongoDB, and server-rendered EJS views. Users can discover stays, search by destination, create and manage their own listings, upload listing images, and leave reviews.

## Features

- Browse all available listings.
- Search listings by title, location, or country.
- View listing details, owner information, reviews, and an interactive map.
- Create, edit, and delete listings after signing in.
- Upload listing images to Cloudinary.
- Register, log in, log out, and persist authenticated sessions.
- Add 1-to-5-star reviews and comments to listings.
- Delete reviews as their author.
- Validate listing and review input with Joi.
- Show success and error feedback with flash messages.
- Protect listing and review actions with authentication and ownership middleware.

## Technology Stack

### Backend

- Node.js 22.17.0
- Express 5
- MongoDB with Mongoose
- Passport and `passport-local-mongoose` for authentication
- Express Session with MongoDB-backed session storage
- Joi for request validation
- Multer and Cloudinary for image uploads

### Frontend

- EJS templates with EJS Mate layouts
- Bootstrap styles and custom CSS
- Vanilla JavaScript
- MapTiler SDK and geocoding API

## Requirements

- Node.js `22.17.0` or a compatible Node.js 22 release
- npm
- A MongoDB database, local or MongoDB Atlas
- A Cloudinary account for listing image uploads
- A MapTiler API key for map and geocoding features

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/priyanshu2169/Wanderlust.git
cd Wanderlust
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root. Do not commit this file or publish its values.

```env
NODE_ENV=development
Atlasdb_URL=mongodb://127.0.0.1:27017/Wanderlust
SECRET=replace-with-a-long-random-session-secret
CLOUD_NAME=your-cloudinary-cloud-name
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRET=your-cloudinary-api-secret
Map_API=your-maptiler-api-key
```

`Atlasdb_URL` can point to MongoDB Atlas instead of a local MongoDB instance. The application uses it for both the main database connection and the session store.

### 4. Start the application

There is currently no `start` script in `package.json`, so start the server directly:

```bash
node app.js
```

The application listens on [http://localhost:8080](http://localhost:8080). Open `/listings` to browse listings.

## Sample Data

The sample data lives in `init/data.js`. The initialization script inserts that data into a local MongoDB database named `Wanderlust`:

```bash
node init/index.js
```

The current initializer uses `mongodb://127.0.0.1:27017/Wanderlust` directly, rather than `Atlasdb_URL`, and assigns listings to a fixed owner id. Before using it in a fresh database, update `init/index.js` with a valid user id and the desired database URL, or create the required user first.

## Application Routes

| Method | Path | Purpose | Authentication |
| --- | --- | --- | --- |
| GET | `/listings` | Browse all listings | No |
| GET | `/listings/new` | Show the new listing form | Required |
| POST | `/listings` | Create a listing | Required |
| GET | `/listings/:id` | Show a listing and its reviews | No |
| GET | `/listings/:id/edit` | Show the edit form | Owner only |
| PUT | `/listings/:id` | Update a listing | Owner only |
| DELETE | `/listings/:id` | Delete a listing | Owner only |
| POST | `/listings/:id/reviews` | Add a review | Required |
| DELETE | `/listings/:id/reviews/:reviewId` | Delete a review | Review author only |
| GET | `/search?q=<term>` | Search by title, location, or country | No |
| GET | `/signup` | Show the registration form | No |
| POST | `/signup` | Register a user | No |
| GET | `/login` | Show the login form | No |
| POST | `/login` | Authenticate a user | No |
| GET | `/logout` | End the current session | Required session |

## Project Structure

```text
Wanderlust/
├── app.js                 # Express application, database, sessions, and middleware
├── cloudConfig.js         # Cloudinary configuration and upload storage
├── middleware.js          # Authentication, ownership, and Joi validation middleware
├── Schema.js              # Joi schemas for listings and reviews
├── package.json           # Dependencies and Node.js version requirement
├── controller/            # Request handlers for listings, reviews, users, and search
├── routes/                # Express route definitions
├── Models/                # Mongoose models for listings, reviews, and users
├── init/                  # Sample listing data and database initializer
├── views/                 # EJS pages and shared layouts/partials
├── public/                # CSS, browser JavaScript, and map integration
└── utils/                 # Express errors and async route helper
```

## Data Model

- **User**: username and required email, with password authentication managed by `passport-local-mongoose`.
- **Listing**: title, description, image metadata, price, location, country, owner, and referenced reviews.
- **Review**: rating from 1 to 5, comment, creation date, and author reference.

Deleting a listing also removes its associated reviews through a Mongoose delete hook.

## Security and Configuration Notes

- Keep `.env` private. Rotate any credential that has been exposed.
- Use a long, unpredictable value for `SECRET`.
- Listing edits and deletes are restricted to the listing owner.
- Review deletion is restricted to the review author.
- Uploaded images are limited to PNG, JPG, and JPEG formats by the Cloudinary storage configuration.
- In production, set `NODE_ENV=production` and provide production MongoDB, Cloudinary, MapTiler, and session-secret values.

## Development Notes

The project currently has no automated test suite or lint script. The available npm test command is the default placeholder:

```bash
npm test
```

For local development, run the server with `node app.js` and verify the main flows manually: registration, login, listing creation with an image, listing ownership checks, search, reviews, and logout.

## License

This project currently declares the ISC license in `package.json`.