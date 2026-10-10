const express = require('express');
const app = express();

const conn = require('./conn.js');

//set engine
app.set("view engine", "ejs");

//use public folder
app.use(express.static("public"));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//styled alert helper
function sendAlert(res, message, redirect) {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="/style.css">
    </head>
    <body class="alert-body">
        <div class="cloud cloud1"></div>
        <div class="cloud cloud2"></div>
        <div class="cloud cloud3"></div>
        <div class="petal" style="left:15%; animation-duration:9s;"></div>
        <div class="petal" style="left:40%; animation-duration:11s; animation-delay:2s;"></div>
        <div class="petal" style="left:70%; animation-duration:8s; animation-delay:1s;"></div>
        <div class="petal" style="left:90%; animation-duration:10s; animation-delay:3s;"></div>
        <div class="alert-box">
            <div class="alert-icon">&#10003;</div>
            <h2>${message}</h2>
            <div class="alert-bar"><div class="alert-bar-fill"></div></div>
        </div>
        <script>
            setTimeout(() => {
                window.location.href = '${redirect}';
            }, 2000);
        </script>
    </body>
    </html>`);
}

app.get('/', (req, res) => {
    res.render('login', {title: "Login - Boarding House"});
});

//login page
app.get('/login', (req, res) => {
    res.render('login', {title: "Login - Boarding House"});
});

//login check
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const sql = `SELECT * FROM users WHERE email="${email}" AND password="${password}"`;
    conn.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            sendAlert(res, "Login Successfully!", '/user_list');
        } else {
            res.render('login', {
                title: "Login - Boarding House",
                error: "Invalid email or password!"
            });
        }
    });
});

app.get('/add_user', (req, res) => {
    res.render('signup', {title: "Sign Up - Boarding House"});
});

//signup page
app.get('/signup', (req, res) => {
    res.render('signup', {title: "Sign Up - Boarding House"});
});
//post or get data from your textbox and store it in the database
app.post('/add_user', (req, res) => {

    const user_id = 0;
    const fn = req.body.fn;
    const ln = req.body.ln;
    const address = req.body.address;
    const email = req.body.email;
    const password = req.body.password;
    const cn = req.body.cn;

    console.log(`First Name: ${fn}`);
    console.log(`Last Name: ${ln}`);
    console.log(`Address: ${address}`);
    console.log(`Email: ${email}`);
    console.log(`Contact: ${cn}`);

    const sql = `INSERT INTO users (fn, ln, address, email, password, cn)
        VALUES("${fn}",
"${ln}",
"${address}",
"${email}",
"${password}",
"${cn}")`;

    conn.query(sql,(err, result) => {
        if (err) throw err;
        console.log("1 Tenant added");
        sendAlert(res, "1 Tenant Added Successfully!", '/user_list');
    });
});

app.get('/user_list', (req, res) => {
    const getdata = `SELECT * FROM users`;
    conn.query(getdata, (err, mydata) => {
        if (err) throw err;
        res.render('user_list', {
            title: "List Page",
            action: "list",
            sampledata: mydata });
    });
});


//delete data
app.get('/delete_user/:myid', (req, res) => {
    const del_id = req.params.myid;
    const toDelete = `DELETE FROM users WHERE id='${del_id}'`;
    conn.query(toDelete, (err, result) =>
    {
        if (err) throw err;
        console.log("1 Data is Deleted");
        sendAlert(res, "1 Tenant Deleted Successfully!", '/user_list');
    });
});

//get data to update
app.get('/update_user/:myid', (req, res) => {

    const user_id = req.params.myid;

    console.log(`User ID: ${user_id}`);

    const getdata = `SELECT * FROM users WHERE id='${user_id}'`;
    conn.query(getdata, (err, result) => {
        if (err) throw err;
        res.render('update', {
         title: "Update Page",
         action: "updatedList",
            sampledata: result
        });
    });
});

//post updated data
app.post('/update_user/:myid', (req, res) => {

    const user_id = req.params.myid;
    const fn = req.body.fn;
    const ln = req.body.ln;
    const address = req.body.address;
    const email = req.body.email;
    const password = req.body.password;
    const cn = req.body.cn;

    const toUpdate = `UPDATE users SET
        fn="${fn}",
        ln="${ln}",
        address="${address}",
        email="${email}",
        password="${password}",
        cn="${cn}"
        WHERE id="${user_id}"`;

    conn.query(toUpdate, (err, result) => {
        if (err) throw err;
        console.log("1 Data is Updated");
        sendAlert(res, "1 Tenant Updated Successfully!", '/user_list');
    });
});

app.listen(3000, () => {
    console.log("Running in port 3000");
});
