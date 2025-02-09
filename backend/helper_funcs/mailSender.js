const nodemailer = require(`nodemailer`);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "Roomble360@gmail.com", // Your Gmail address
        pass: "soye ozqg fecr serp",    // Your Gmail App Password (Not your real password)
    },
});


async function Sendmail(Recipient_email, Subject, body) {
    const mailOptions = {
        from: "Roomble360@gmail.com",  // Sender's email
        to: Recipient_email,
        subject: Subject,
        text: body,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error:", error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

module.exports = Sendmail
