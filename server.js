// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

let names = ['Ben'];

// [START app]
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.TOKEN
    }
});

let mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL_DESTINATION,
    subject: 'Insta-Data',
    text: 'That was easy'
};

// [START enable_parser]
// This middleware is available in Express v4.16.0 onwards
app.use(express.urlencoded({extended: true}));
// [END enable_parser]

app.get('/', (req, res) => {
  //res.send('Hello from App Engine!');
  res.sendFile(path.join(__dirname, '/views/form.html'));
});

// [START add_post_handler]
app.post('/', (req, res) => {
  console.log({
    name: req.body.name,
    message: req.body.message,
  });
    
  names.push(req.body.name);

    mailOptions.text = 'Name: ' + req.body.name + ', Msg: ' + req.body.message;

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            res.status(411);
        } else {
            res.status(201);
        }
    });

    res.send('Welcome, ' + req.body.name);
});
// [END add_post_handler]

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
// [END app]

module.exports = app;
