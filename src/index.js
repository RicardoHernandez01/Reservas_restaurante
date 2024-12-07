const app = require('./app/app');

const port = process.env.PORT || 3001

app.listen(port, "0.0.0.0" ,() =>{
    console.log(`--------- server running on port ${port}`)
})