const DBConnection = {
    server: "DESKTOP-7Q5OG91\\SQLEXPRESS01",
    database: "NodeJsDb",
    user: "sanad",
    password: "123456789",
    options: {
        encrypt: true
    },
    pool: {
        min: 2
    }
}

module.exports = DBConnection;