This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/zeit/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open []() with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/zeit/next.js/) - your feedback and contributions are welcome!

ChatAway
Description
A work in progress but functional chat app similar to Slack, having both room and direct chat.

Developed as a way to supplement my front-end skills with new back-end abilities.

The information below only applies to the current state of the app. Being a proof of my abilities /work in progress, the app will be gradually updated as I improve my skills and add new features.

Disclaimer: Missing features and links that do not work as intended means that part was not implemented yet.

Features
Main features of the application are:
Authentication: User sign up, log in, , log out, forgot password/reset password by email.

Chat features: Room chat, direct friend chat, edit user profile: name, email, password, avatar, delete account.

UX: Server-side rendered (SSR), fully responsive design, complete user privacy, great account/data security.

Documentation
Github code
Main stack (MERN): MongoDB, Express, React, Node

Secondary stack: Next.js, Material-UI

Dependencies:
Security: bcryptjs, express-mongo-sanitize, express-rate-limit, helmet hpp, json web token, xss-clean, validator, cors.

Data fetching: axios, useSWR.

Data modelling: mongoose, mongoDB.

Forms/Image processing: Formik, Yup, Multer, Sharp.

Email: nodemailer, nodemailer-express-handlebars, html-to-text, SendGrid.

Routes:
Postman API routes link
Environment variables
Required environmental variables in this project include:
DATABASE: MongoDB ChatAway connection string
DATABASE_PASSWORD: MongoDB ChatAway database password
JWT_SECRET: the secret string required for password encryption
JWT_EXPIRES_IN: the time that the user token lasts
JWT_COOKIE_EXPIRES_IN: the time that the user cookie lasts
EMAIL_FROM: the ChatAway mail account
SENDGRID_USERNAME: the SendGrid username for nodemailer
SENDGRID_PASSWORD: the SendGrid password for nodemailer
