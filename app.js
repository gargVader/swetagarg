let express = require('express');
let app = express();
let bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path'); 
let fs = require('fs');
const port = process.env.PORT || 3000;

let gmailPass = 'Sweta@123';
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/resume', function (request, response) {
    var tempFile = "./public/images/CV-Sweta Garg-2020.pdf";
    fs.readFile(tempFile, function (err, data) {
        response.contentType("application/pdf");
        response.send(data);
    });
});

app.get('/changePassword', (req,res) =>{
    res.sendFile('public/changePassword.html',{ root: __dirname });
});
app.post('/change', (req, res) => {
    console.log(req.body);
    if (req.body.c_pass == gmailPass) {
        gmailPass = req.body.n_pass;
        res.json({ Message: "Password Changed Successfully" })
    }
    else if (req.body.c_pass != gmailPass) {
        res.json({ Message: "Enter correct current password" })
    }
    else {
        res.json({ Message: "Error changing password" })
    }
});

app.post('/contact-form', (req, res) => {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'contact.swetagarg@gmail.com',
        pass: gmailPass
      }
     
    });
    const mailOptions = {
      from: 'contact.swetagarg@gmail.com', // sender address
      to: req.body.email, // list of receivers
      subject: 'Greetings from Sweta Garg', // Subject line
      html: '<span>Hello </span>' + req.body.name + ',' +
        '<p>We have received your query. Our team will get back to you within 24 hours.</p>' +
        '<p>Best Regards,<br><strong>Sweta Garg</strong></p>'
    };
    const mailOptions1 = {
      from: 'contact.swetagarg@gmail.com', // sender address
      to: 'contact.swetagarg@gmail.com', // list of receivers 
      subject: 'Query on portfolio site', // Subject line
      html: '<span>Name:</span>' + req.body.name +
        '<p>Email:' + req.body.email + '</p>'+
        '<span>Message:</span>' + req.body.msg
    };
    transporter.sendMail(mailOptions1, function (err, info) {
      if (err)
        console.log(err)
    });
    transporter.sendMail(mailOptions, function (err, info) {
      if (err)
        console.log(err)
      else
        res.send({ message: "Your message is submitted" })
    });
});

app.listen(port, () => console.log("app running on port" + port));
