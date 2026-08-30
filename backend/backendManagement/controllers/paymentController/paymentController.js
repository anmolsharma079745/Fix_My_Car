const crypto = require("crypto");
const PDFDocument = require("pdfkit");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const razorpay = require("../../config/razorpay");

const paymentModel = require("../../models/paymentModel/paymentModel");
const bookingModel = require("../../models/bookingModel/bookingModel");
const serviceModel = require("../../models/serviceModel/serviceModel");
const vehicleModel = require("../../models/vehicleModel/vehicleModel");
const userModel = require("../../models/userModel/userModel");



const createPaymentOrder = async (req, res) => {

    try {

        const { bookingId } = req.body;



        if (!bookingId) {

            return res.status(400).json({

                message:
                    "Booking ID is required"

            });

        }



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



        if (booking.status !== "Completed") {

            return res.status(400).json({

                message:
                    "Payment is available only after the service is completed"

            });

        }



        if (booking.paymentStatus === "paid") {

            return res.status(400).json({

                message:
                    "Payment has already been completed for this booking"

            });

        }



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



        const amount =
            Number(service.price);


        if (!amount || amount <= 0) {

            return res.status(400).json({

                message:
                    "Invalid Service Amount"

            });

        }



        const existingPayment =
            await paymentModel.findOne({

                bookingId: booking._id,

                userId: req.user.id,

                status: "pending"

            });



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



        return res.status(201).json({

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


        return res.status(500).json({

            message:
                "Internal Server Error",

            error:
                err.message

        });

    }

};




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



            doc
                .moveTo(50, doc.y)
                .lineTo(545, doc.y)
                .stroke();


            doc.moveDown(1);



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
                        data.booking.bookingDate
                            ? new Date(
                                data.booking.bookingDate
                            ).toLocaleDateString("en-IN")
                            : "N/A"
                    }`
                )
                .text(
                    `Booking Time: ${
                        data.booking.bookingTime || "N/A"
                    }`
                );


            doc.moveDown(1);



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
                        data.payment.razorpayPaymentId || "N/A"
                    }`
                )
                .text(
                    `Order ID: ${
                        data.payment.razorpayOrderId || "N/A"
                    }`
                )
                .text(
                    `Payment Date: ${
                        data.payment.paidAt
                            ? new Date(
                                data.payment.paidAt
                            ).toLocaleString("en-IN")
                            : "N/A"
                    }`
                )
                .text(
                    "Payment Status: PAID"
                );


            doc.moveDown(1);



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




const verifyPayment = async (req, res) => {

    try {

        const {

            razorpay_order_id,

            razorpay_payment_id,

            razorpay_signature

        } = req.body;



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



        if (payment.status === "paid") {

            return res.status(400).json({

                message:
                    "This payment has already been verified"

            });

        }



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



        if (booking.status !== "Completed") {

            return res.status(400).json({

                message:
                    "Payment cannot be completed before the service is completed"

            });

        }



        payment.razorpayPaymentId =
            razorpay_payment_id;


        payment.razorpaySignature =
            razorpay_signature;


        payment.status =
            "paid";


        payment.paidAt =
            new Date();


        await payment.save();



        booking.paymentStatus =
            "paid";


        await booking.save();



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



        const pdfBuffer =
            await generateReceiptPDF({

                customer,

                vehicle,

                service,

                booking,

                payment

            });



        if (!process.env.RESEND_API_KEY) {

            throw new Error(
                "RESEND_API_KEY is not configured"
            );

        }


        if (!customer.email) {

            throw new Error(
                "Customer email is not available"
            );

        }



        console.log(
            "Customer Email:",
            customer.email
        );

        console.log(
            "Starting receipt email..."
        );


        const { data, error } =
            await resend.emails.send({

                from:
                    "Fix My Ride <onboarding@resend.dev>",

                to:
                    customer.email,

                subject:
                    "Fix My Ride - Payment Receipt",

                text:
                    `Hello ${customer.name || "Customer"},\n\n` +
                    `Your payment of ₹${payment.amount} has been successfully completed.\n\n` +
                    `Please find your payment receipt attached.\n\n` +
                    `Payment ID: ${payment.razorpayPaymentId}\n` +
                    `Order ID: ${payment.razorpayOrderId}\n\n` +
                    `Thank you for choosing Fix My Ride.`,

                attachments: [

                    {

                        filename:
                            `Fix-My-Ride-Receipt-${payment.razorpayPaymentId}.pdf`,

                        content:
                            pdfBuffer

                    }

                ]

            });



        if (error) {

            console.error(
                "Resend Email Error:",
                error
            );


            throw new Error(
                error.message ||
                "Failed to send receipt email"
            );

        }



        console.log(
            "Receipt email sent successfully!"
        );


        console.log(
            "Resend Email ID:",
            data?.id
        );



        return res.status(200).json({

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


        return res.status(500).json({

            message:
                "Payment Verified But Receipt/Email Process Failed",

            error:
                err.message

        });

    }

};




module.exports = {

    createPaymentOrder,

    verifyPayment

};