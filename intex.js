const express = require('express');
const app = express();
app.use(express.json());

const otpExpiry = {};

app.post('/generate-otp', (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    const otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    otpExpiry[phoneNumber] = { otp: otp, expiry: new Date(Date.now() + 5 * 60000) };
    console.log(`Generated OTP ${otp} for ${phoneNumber}`);
    res.json({ message: `OTP generated for ${phoneNumber}` });
});

app.post('/verify-otp', (req, res) => {
    const { phoneNumber, otp } = req.body;
    if (phoneNumber in otpExpiry) {
        if (new Date() < otpExpiry[phoneNumber].expiry) {
            if (parseInt(otp) === otpExpiry[phoneNumber].otp) {
                console.log("OTP verification successful");
                res.json({ message: "OTP verification successful" });
            } else {
                console.log("Incorrect OTP");
                res.status(400).json({ message: "Incorrect OTP" });
            }
        } else {
            console.log("OTP expired");
            res.status(400).json({ message: "OTP expired" });
        }
    } else {
        console.log("No OTP generated for this number");
        res.status(400).json({ message: "No OTP generated for this number" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});