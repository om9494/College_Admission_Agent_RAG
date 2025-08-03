const nodemailer = require('nodemailer');


exports.emailler =  async (req, res) => {
    try {
        const { name } = req.body; //Get the college name from the request body

        //Create a nodemailer transporter using your email service credentials
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            secure: true,
            port: 587,
            tls: {
                rejectUnauthorized: false // Add this line
            }
        });



        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.DTE_EMAIL, // Admin Email ID
            subject: `College Data Update Verification for ${name}`,
            html: `
              <p>College data for ${name} has been updated. Please review the changes.</p>
              <p> This is an auto-generated email. </p>
            `,
        };

        //Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);

        res.status(200).json({ message: 'Verification email sent successfully' });


    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send verification email' });
    }

};