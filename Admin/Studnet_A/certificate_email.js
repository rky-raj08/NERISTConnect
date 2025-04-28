async function sendCertificateDecisionEmail(email, name, certificateType, decision) {
    let subject, text;

    if (decision === "approve") {
        subject = "Certificate Request Approved";
        text = `Dear ${name},\n\nYour request for a "${certificateType}" certificate has been approved.\nPlease collect it from the office within 2 days.\n\nThank you.`;
    } else if (decision === "reject") {
        subject = "Certificate Request Rejected";
        text = `Dear ${name},\n\nWe regret to inform you that your request for a "${certificateType}" certificate has been rejected.\nFor more details, kindly contact the admin.\n\nThank you.`;
    } else {
        throw new Error("Invalid decision type. Must be 'approve' or 'reject'.");
    }

    const mailOptions = {
        from: "nerist388@gmail.com",
        to: email,
        subject: subject,
        text: text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, error: error.message };
    }
}

module.exports = { sendCertificateDecisionEmail };