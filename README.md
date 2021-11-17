# CRM Ticket system API

This is a part of create CRM Ticket system with MERN stack from scratch tutorial series.
Link for the series are

## How to use

- run `git clone ...`
- run `npm start`

Note: Make sure you have nodemon is installed in your system otherwise you can install as a dev dependencies in the project.

## API Resources

### UserAPI Resources

All the user API router follow `/v1/user/`

| # | Routers | Verbs | Progress | Is Private | Description
| 1 | `/v1/user/login | POST | TODO | No | Verify user Authenticatio and return JWT | 2 | `/v1/user/request-rest-password | POST | TODO | No | Verify email and email pin to reset the password
| 3 | `/v1/user/reset-password | PUT | TODO | No | Replace with new password | 4 | `/v1/user/{id} | GET | TODO | No | Get users info
