<p align="center">
 <a href="https://ibb.co/QJPSqH7"><img width=200px height=auto src="https://i.ibb.co/p1fVsK6/ChatAway.png" alt="ChatAway"  /></a>
</p>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>


---

<h1 align="center"><a href="chat-away-app.herokuapp.com" >Live demo</a></h1>

<p align="center"> Slack-type chat app with fully built back-end.
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Usage](#usage)
- [Built Using](#built_using)
- [Environment Variables](#env_vars)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

## 🧐 About <a name = "about"></a>

Developed as a way to learn and practice the MERN stack, with a focus on Express and MongoDB.


<h2> Features</h2>

<strong>Authentication</strong>: User sign up, log in, , log out, forgot password/reset password by email.

<strong>Chat features</strong>: Room chat, direct friend chat, edit user profile: name, email, password, avatar, delete account.

<strong>UX</strong>: Server-side rendered (SSR), responsive design, data security.

<h3>Disclaimer<h3>

Missing features and links that do not work as intended means that part was not implemented yet.



## 🎈 Usage <a name="usage"></a>

Feel free to test the app by signing up, leave a few messages, edit your user profile. 

## ⛏️ Built Using <a name="built_using"></a>

- [MongoDB](https://www.mongodb.com/) - Database
- [Express](https://expressjs.com/) - Server Framework
- [React](https://reactjs.org/) - Web Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment
- [Next.js](https://nextjs.org) - React dev framework
- [Material-UI](https://material-ui.com) - UI library


<h2> Other dependencies:<h3>

<strong>Security</strong>: bcryptjs, express-mongo-sanitize, express-rate-limit, helmet hpp, json web token, xss-clean, validator, cors.

<strong>Data fetching</strong>: axios, useSWR.

<strong>Data modelling</strong>: mongoose.

<strong>Forms/Image processing</strong>: Formik, Yup, Multer, Sharp.

<strong>Email</strong>: nodemailer, nodemailer-express-handlebars, html-to-text, SendGrid.

<strong>Routes</strong>: <a href="https://documenter.getpostman.com/view/11920996/T17FAU73">Postman API routes</a>

## Environment variables <a name ="env_vars"></a>

Required environmental variables in this project include:
```
DATABASE: MongoDB ChatAway connection string

DATABASE_PASSWORD: MongoDB ChatAway database password

JWT_SECRET: the secret string required for password encryption

JWT_EXPIRES_IN: the time that the user token lasts

JWT_COOKIE_EXPIRES_IN: the time that the user cookie lasts

EMAIL_FROM: the ChatAway mail account

SENDGRID_USERNAME: the SendGrid username for nodemailer

SENDGRID_PASSWORD: the SendGrid password for nodemailer
```

## ✍️ Authors <a name = "authors"></a>

- [@EmilLM](https://github.com/EmilLM) 

## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- Hat tip to anyone whose code was used

