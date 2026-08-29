const crypto = require("crypto");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");

const razorpay = require("../../config/razorpay");

const paymentModel = require("../../models/paymentModel/paymentModel");
const bookingModel = require("../../models/bookingModel/bookingModel");
const serviceModel = require("../../models/serviceModel/serviceModel");
const vehicleModel = require("../../models/vehicleModel/vehicleModel");
const userModel = require("../../models/userModel/userModel");


// =====================================================
// NODEMAILER CONFIG
// =====================================================

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }

});


// =====================================================
// CREATE RAZORPAY ORDER
// CUSTOMER
// PAYMENT ALLOWED ONLY AFTER SERVICE COMPLETED
// =====================================================

const createPaymentOrder = async (req, res) => {

    try {

        const { bookingId } = req.body;


        // =================================================
        // CHECK BOOKING ID
        // =================================================

        if (!bookingId) {

            return res.status(400).json({

                message:
                    "Booking ID is required"

            });

        }


        // =================================================
        // FIND CUSTOMER BOOKING
        // =================================================

        const booking =
            await bookingModel.findOne({

                _id: bookingId,

                userId: req.user.id

            });


        if (!booking) {

            return res.status(404).json({

                message:
                    "Booking Not Found"

            });

        }


        // =================================================
        // PAYMENT ONLY AFTER SERVICE IS COMPLETED
        // =================================================

        if (booking.status !== "Completed") {

            return res.status(400).json({

                message:
                    "Payment is available only after the service is completed"

            });

        }


        // =================================================
        // CHECK PAYMENT STATUS
        // =================================================

        if (booking.paymentStatus === "paid") {

            return res.status(400).json({

                message:
                    "Payment has already been completed for this booking"

            });

        }


        // =================================================
        // FIND SERVICE
        // =================================================

        const service =
            await serviceModel.findById(
                booking.serviceId
            );


        if (!service) {

            return res.status(404).json({

                message:
                    "Service Not Found"

            });

        }


        // =================================================
        // FIND VEHICLE
        // =================================================

        const vehicle =
            await vehicleModel.findOne({

                _id: booking.vehicleId,

                userId: req.user.id

            });


        if (!vehicle) {

            return res.status(404).json({

                message:
                    "Vehicle Not Found"

            });

        }


        // =================================================
        // SERVICE PRICE
        // =================================================

        const amount =
            Number(service.price);


        if (!amount || amount <= 0) {

            return res.status(400).json({

                message:
                    "Invalid Service Amount"

            });

        }


        // =================================================
        // CHECK EXISTING PENDING PAYMENT
        // =================================================

        const existingPayment =
            await paymentModel.findOne({

                bookingId: booking._id,

                userId: req.user.id,

                status: "pending"

            });


        // =================================================
        // IF PENDING PAYMENT ALREADY EXISTS
        // RETURN SAME ORDER
        // =================================================

        if (existingPayment) {

            return res.status(200).json({

                message:
                    "Existing Payment Order Found",

                paymentId:
                    existingPayment._id,

                razorpayOrderId:
                    existingPayment.razorpayOrderId,

                amount:
                    existingPayment.amount,

                currency:
                    "INR",

                keyId:
                    process.env.RAZORPAY_KEY_ID

            });

        }


        // =================================================
        // RAZORPAY ORDER
        // =================================================

        const options = {

            amount:
                Math.round(amount * 100),

            currency:
                "INR",

            receipt:
                `booking_${booking._id}`

        };


        const razorpayOrder =
            await razorpay.orders.create(
                options
            );


        // =================================================
        // SAVE PAYMENT
        // =================================================

        const payment =
            await paymentModel.create({

                userId:
                    req.user.id,

                bookingId:
                    booking._id,

                vehicleId:
                    booking.vehicleId,

                serviceId:
                    booking.serviceId,

                amount:
                    amount,

                razorpayOrderId:
                    razorpayOrder.id,

                status:
                    "pending"

            });


        // =================================================
        // RESPONSE
        // =================================================

        res.status(201).json({

            message:
                "Payment Order Created Successfully",

            paymentId:
                payment._id,

            razorpayOrderId:
                razorpayOrder.id,

            amount:
                amount,

            currency:
                "INR",

            keyId:
                process.env.RAZORPAY_KEY_ID

        });


    } catch (err) {

        console.error(
            "Create Payment Order Error:",
            err
        );


        res.status(500).json({

            message:
                "Internal Server Error",

            error:
                err.message

        });

    }

};



// =====================================================
// GENERATE PDF RECEIPT
// =====================================================

const generateReceiptPDF = (data) => {

    return new Promise((resolve, reject) => {

        try {

            const doc =
                new PDFDocument({

                    size: "A4",

                    margin: 50

                });


            const chunks = [];


            doc.on("data", (chunk) => {

                chunks.push(chunk);

            });


            doc.on("end", () => {

                const pdfBuffer =
                    Buffer.concat(chunks);

                resolve(pdfBuffer);

            });


            doc.on("error", (error) => {

                reject(error);

            });


            // =================================================
            // HEADER
            // =================================================

            doc
                .fontSize(24)
                .font("Helvetica-Bold")
                .text(
                    "FIX MY RIDE",
                    {
                        align: "center"
                    }
                );


            doc
                .moveDown(0.5)
                .fontSize(18)
                .font("Helvetica-Bold")
                .text(
                    "Payment Receipt",
                    {
                        align: "center"
                    }
                );


            doc.moveDown(1);


            // =================================================
            // LINE
            // =================================================

            doc
                .moveTo(50, doc.y)
                .lineTo(545, doc.y)
                .stroke();


            doc.moveDown(1);


            // =================================================
            // CUSTOMER DETAILS
            // =================================================

            doc
                .fontSize(12)
                .font("Helvetica-Bold")
                .text(
                    "Customer Details"
                );


            doc.moveDown(0.4);


            doc
                .font("Helvetica")
                .text(
                    `Name: ${data.customer.name || "N/A"}`
                )
                .text(
                    `Email: ${data.customer.email || "N/A"}`
                )
                .text(
                    `Phone: ${data.customer.phone || "N/A"}`
                );


            doc.moveDown(1);


            // =================================================
            // VEHICLE DETAILS
            // =================================================

            doc
                .font("Helvetica-Bold")
                .text(
                    "Vehicle Details"
                );


            doc.moveDown(0.4);


            doc
                .font("Helvetica")
                .text(
                    `Vehicle: ${data.vehicle.vehicleName || "N/A"}`
                )
                .text(
                    `Model: ${data.vehicle.model || "N/A"}`
                )
                .text(
                    `Number Plate: ${data.vehicle.numberPlate || "N/A"}`
                )
                .text(
                    `Vehicle Type: ${data.vehicle.vehicleType || "N/A"}`
                );


            doc.moveDown(1);


            // =================================================
            // SERVICE DETAILS
            // =================================================

            doc
                .font("Helvetica-Bold")
                .text(
                    "Service Details"
                );


            doc.moveDown(0.4);


            doc
                .font("Helvetica")
                .text(
                    `Service: ${
                        data.service.name ||
                        data.service.serviceName ||
                        "Service"
                    }`
                )
                .text(
                    `Booking Date: ${
                        new Date(
                            data.booking.bookingDate
                        ).toLocaleDateString("en-IN")
                    }`
                )
                .text(
                    `Booking Time: ${
                        data.booking.bookingTime
                    }`
                );


            doc.moveDown(1);


            // =================================================
            // PAYMENT DETAILS
            // =================================================

            doc
                .font("Helvetica-Bold")
                .text(
                    "Payment Details"
                );


            doc.moveDown(0.4);


            doc
                .font("Helvetica")
                .text(
                    `Payment ID: ${
                        data.payment.razorpayPaymentId
                    }`
                )
                .text(
                    `Order ID: ${
                        data.payment.razorpayOrderId
                    }`
                )
                .text(
                    `Payment Date: ${
                        new Date(
                            data.payment.paidAt
                        ).toLocaleString("en-IN")
                    }`
                )
                .text(
                    "Payment Status: PAID"
                );


            doc.moveDown(1);


            // =================================================
            // AMOUNT
            // =================================================

            doc
                .fontSize(16)
                .font("Helvetica-Bold")
                .text(
                    `Amount Paid: ₹${data.payment.amount}`,
                    {
                        align: "right"
                    }
                );


            doc.moveDown(2);


            // =================================================
            // FOOTER
            // =================================================

            doc
                .fontSize(12)
                .font("Helvetica")
                .text(
                    "Payment Successful",
                    {
                        align: "center"
                    }
                );


            doc
                .moveDown(0.5)
                .text(
                    "Thank you for choosing Fix My Ride!",
                    {
                        align: "center"
                    }
                );


            doc
                .moveDown(0.5)
                .fontSize(9)
                .text(
                    "This is a computer-generated payment receipt.",
                    {
                        align: "center"
                    }
                );


            doc.end();


        } catch (error) {

            reject(error);

        }

    });

};



// =====================================================
// VERIFY RAZORPAY PAYMENT
// + UPDATE BOOKING PAYMENT STATUS
// + PDF RECEIPT
// + EMAIL RECEIPT
// =====================================================

const verifyPayment = async (req, res) => {

    try {

        const {

            razorpay_order_id,

            razorpay_payment_id,

            razorpay_signature

        } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {

            return res.status(400).json({

                message:
                    "Payment verification details are required"

            });

        }


        // =================================================
        // FIND PAYMENT
        // =================================================

        const payment =
            await paymentModel.findOne({

                razorpayOrderId:
                    razorpay_order_id,

                userId:
                    req.user.id

            });


        if (!payment) {

            return res.status(404).json({

                message:
                    "Payment Record Not Found"

            });

        }


        // =================================================
        // PREVENT DUPLICATE VERIFICATION
        // =================================================

        if (payment.status === "paid") {

            return res.status(400).json({

                message:
                    "This payment has already been verified"

            });

        }


        // =================================================
        // CREATE SIGNATURE
        // =================================================

        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(
                    `${razorpay_order_id}|${razorpay_payment_id}`
                )
                .digest("hex");


        // =================================================
        // VERIFY SIGNATURE
        // =================================================

        if (
            generatedSignature !==
            razorpay_signature
        ) {

            payment.status =
                "failed";


            await payment.save();


            return res.status(400).json({

                message:
                    "Invalid Payment Signature"

            });

        }


        // =================================================
        // GET BOOKING
        // =================================================

        const booking =
            await bookingModel.findOne({

                _id:
                    payment.bookingId,

                userId:
                    req.user.id

            });


        if (!booking) {

            return res.status(404).json({

                message:
                    "Booking Not Found"

            });

        }


        // =================================================
        // PAYMENT CAN ONLY BE COMPLETED
        // AFTER SERVICE IS COMPLETED
        // =================================================

        if (booking.status !== "Completed") {

            return res.status(400).json({

                message:
                    "Payment cannot be completed before the service is completed"

            });

        }


        // =================================================
        // UPDATE PAYMENT
        // =================================================

        payment.razorpayPaymentId =
            razorpay_payment_id;


        payment.razorpaySignature =
            razorpay_signature;


        payment.status =
            "paid";


        payment.paidAt =
            new Date();


        await payment.save();


        // =================================================
        // UPDATE BOOKING PAYMENT STATUS
        // IMPORTANT:
        // BOOKING STATUS REMAINS "Completed"
        // =================================================

        booking.paymentStatus =
            "paid";


        await booking.save();


        // =================================================
        // GET CUSTOMER
        // =================================================

        const customer =
            await userModel.findById(
                payment.userId
            );


        if (!customer) {

            return res.status(404).json({

                message:
                    "Customer Not Found"

            });

        }


        // =================================================
        // GET VEHICLE
        // =================================================

        const vehicle =
            await vehicleModel.findById(
                payment.vehicleId
            );


        if (!vehicle) {

            return res.status(404).json({

                message:
                    "Vehicle Not Found"

            });

        }


        // =================================================
        // GET SERVICE
        // =================================================

        const service =
            await serviceModel.findById(
                payment.serviceId
            );


        if (!service) {

            return res.status(404).json({

                message:
                    "Service Not Found"

            });

        }


        // =================================================
        // GENERATE PDF
        // =================================================

        const pdfBuffer =
            await generateReceiptPDF({

                customer,

                vehicle,

                service,

                booking,

                payment

            });


        // =================================================
        // SEND EMAIL
        // =================================================

        await transporter.sendMail({

            from:
                process.env.EMAIL_USER,

            to:
                customer.email,

            subject:
                "Fix My Ride - Payment Receipt",

            text:
                `Hello ${customer.name || "Customer"},\n\n` +
                `Your payment of ₹${payment.amount} has been successfully completed.\n\n` +
                `Please find your payment receipt attached.\n\n` +
                `Thank you for choosing Fix My Ride.`,

            attachments: [

                {

                    filename:
                        `Fix-My-Ride-Receipt-${payment.razorpayPaymentId}.pdf`,

                    content:
                        pdfBuffer,

                    contentType:
                        "application/pdf"

                }

            ]

        });


        // =================================================
        // FINAL RESPONSE
        // =================================================

        res.status(200).json({

            message:
                "Payment Verified Successfully. Receipt Generated and Email Sent.",

            paymentId:
                payment._id,

            razorpayPaymentId:
                payment.razorpayPaymentId,

            amount:
                payment.amount,

            status:
                payment.status,

            bookingStatus:
                booking.status,

            paymentStatus:
                booking.paymentStatus,

            receiptSentTo:
                customer.email

        });


    } catch (err) {

        console.error(
            "Verify Payment Error:",
            err
        );


        res.status(500).json({

            message:
                "Payment Verified But Receipt/Email Process Failed",

            error:
                err.message

        });

    }

};



// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    createPaymentOrder,

    verifyPayment

};