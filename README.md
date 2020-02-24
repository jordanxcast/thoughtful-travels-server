# Thoughtful Travels Server
This server is used for the Thoughtful Travels application found at: https://github.com/jordanxcast/thoughtful-travels-client

## Endpoints
- `/api/destinations` - GET & POST requests 
- `/api/destinations/:dest_id` - GET & DELETE & PATCH requests
- `/api/entries/:dest_id` - GET & POST requests
- `/api/entries/:entry_id` - DELETE requests
- `/api/items/:dest_id` - GET & POST requests
- `/api/items/:item_id` - DELETE requests
- `/api/users` - POST requests to create a new user
- `/api/auth/login` - POST requests for existing user to login to their account

## Scripts
- Start the application `npm start`

- Start nodemon for the application `npm run dev`

- Run the tests `npm test`

## Deployed 
Thoughtful Travels server is deployed with Heroku at https://t-travels.herokuapp.com/
