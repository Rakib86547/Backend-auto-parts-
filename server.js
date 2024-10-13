require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./index');
const port = process.env.PORT || 8080;
const colors = require('colors');


mongoose.connect(process.env.DB_URL, {}).then(() => {
    try {
        console.log('Database Connect is Success'.green);
    } catch (error) {
        console.log(error.message);
        console.log('Database Connect is Error'.red)
    }
})

app.listen(port, () => {
    console.log(`server is running on ${port} port`)
});