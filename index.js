const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const cors = require("cors")
const app = express()
const mongoose = require("mongoose")
const authroute = require("./Routes/auth")
const usersroute = require("./Routes/users")
const reviewroute = require("./Routes/Review")
const postsroute = require("./Routes/posts")
const contactroute = require("./Routes/contact")
const bodyParser = require("body-parser");


app.use(
    cors({
        origin: "https://reviewhub-app.netlify.app/",
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    })
);




app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use("/uploads", express.static("./uploads"));
mongoose.connect(process.env.MONGO_URL).then(console.log("DATABASE CONNECTED")).catch(err => { console.log(err) })
app.use("/api/auth", authroute)
app.use("/api/users", usersroute)
app.use("/api/review", reviewroute)
app.use("/api", postsroute)
app.use("/api", contactroute)




app.get('/', async function(req, res) {
    res.send('hey')
})








let port = process.env.PORT || 4000;
app.listen(port, function() {
    console.log(`port ${port} is running `)
})
