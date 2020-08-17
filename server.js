const next = require('next');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
    console.log('Unhandled Rejection! Shutting down...')
    console.log(err.name, err.message);
    process.exit(1)
});
dotenv.config({path:'./server/config.env'});

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev});

// next.js handler for all pages
const handle = nextApp.getRequestHandler();

// next.js custom server
nextApp.prepare().then( () => {

    const app = require('./server/app');

    const DB= process.env.DATABASE;
    mongoose.connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false 
    })
    .then(() => console.log('DB works!'))
    .catch(err => console.error("Connection error", err));

    app.all('*', (req, res) => {
        return handle(req, res)
    });

    // const port = 3000;
    const port = process.env.PORT || 3000;
    app.listen(port, err => console.log(`> Ready on http://localhost:${port}`));

    process.on('unhandledRejection', err => {
        console.log('Unhandled Rejection! Shutting down...')
        console.log(err.name, err.message);
        // Gradually closing the server 
        // changed server to app
        app.close(() => {
            process.exit(1)
        })
        
    })
    process.on('SIGTERM', () => {
        console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
        server.close(() => {
          console.log('💥 Process terminated!');
        });
      });
})