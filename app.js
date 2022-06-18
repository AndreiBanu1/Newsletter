const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

mailchimp.setConfig({
    apiKey: "a0c83cd5aeed4f29dd28e632246f62cb-us17",
    server: "us17",
  });

app.post("/", function(req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    const listId = "cfebd4d66d";
    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
       };

async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
     email_address: subscribingUser.email,
     status: "subscribed",
     merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
        }
    });
    res.sendFile(__dirname + "/success.html")
    console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
   }

   run().catch(e => res.sendFile(__dirname + "/failure.html"));
});


app.post("/failure", function(req, res) {
    res.redirect("/")
});

app.listen(process.env.PORT || 3000, function() {
    console.log("The server is up and running.")
});

/* Unique Audiance ID:
cfebd4d66d */