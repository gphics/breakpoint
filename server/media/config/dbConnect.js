const mongoose = require("mongoose")

module.exports = async() => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("DB RUNNING !!!")
    } catch (error) {
        console.log(error)
    }
}