const mailer = require('nodemailer');

const transport = mailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
                user: 'ctfsanjeev@gmail.com',
                pass: process.env.EMAIL_PASS
        }
});

exports.emailer = (header, body, user) => {
    
        const message = {
                from: 'sanjeev@ctf',
                to: user.email,
                subject: header,
                html: body
        };
        
        transport.sendMail(message, function(err, info) {
                if(err)
                        console.log(err);
                else
                        console.log(info);    
        });
}