# Dress Accessory App

This project is a web application that helps users find accessories that match their outfit images. It consists of a backend server built with Node.js and Express, and a frontend interface for users to upload their outfit images.

## Project Structure

```
dress-accessory-app/
├── backend/
│   ├── .gitignore
│   ├── package.json
│   ├── index.js
│   ├── db.js
│   ├── accessoryData.json
│   └── routes/
│       └── recommend.js
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── README.md
```

## Backend

The backend is responsible for handling requests and serving accessory recommendations based on the uploaded outfit images.

### Setup

1. Navigate to the `backend` directory.
2. Install the required dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   node index.js
   ```

### Routes

- **GET /recommend**: This route handles requests for accessory recommendations based on the uploaded outfit image.

## Frontend

The frontend allows users to upload their outfit images and view recommended accessories.

### Setup

1. Open `index.html` in your web browser.
2. Use the interface to upload an outfit image.

## Usage

1. Upload an outfit image using the frontend interface.
2. The application will process the image and provide accessory recommendations based on the extracted colors.

## License

This project is licensed under the MIT License.