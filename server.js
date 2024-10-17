require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./index');
const port = process.env.PORT || 8080;
const colors = require('colors');
const { errorHandle } = require('./middleware/errorHandleMiddleware');


mongoose.connect(process.env.DB_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
}).then(() => {
    try {
        console.log('Database Connect is Success'.green);
    } catch (error) {
        console.log(error.message);
        console.log('Database Connect is Error'.red)
    }
})

app.use(errorHandle);

app.listen(port, () => {
    console.log(`server is running on ${port} port`)
});