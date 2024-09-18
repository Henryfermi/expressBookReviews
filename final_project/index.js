const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.headers['authorization'];
    
    // Check if token is present
    if (!token) {
        return res.status(403).json({ message: "A token is required for authentication" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, "1234"); // Replace "your_secret_key" with your actual secret
        req.user = decoded; // Attach decoded token payload to request object for further use
    } catch (err) {
        return res.status(401).json({ message: "Invalid Token" });
    }

    return next(); // Proceed to the next middleware or route handler
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
