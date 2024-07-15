const express = require('express');
const router = express.Router();
const zod = require("zod");
const { Vendor, Account, Application } = require("../db");

const applicationBody = zod.object({
    productId: zod.string(),
    quantity: zod.number(),
    shipmentDate: zod.string()
});

const signupBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    application: zod.array(applicationBody)
});

router.post("/signup", async (req, res) => {
    const { success, data, error } = signupBody.safeParse(req.body);
    
    if (!success) {
        return res.status(400).json({
            message: "Incorrect inputs",
            error: error.errors
        });
    }

    try {
        const isVendor = await Vendor.findOne({ username: data.username });

        if (isVendor) {
            return res.status(400).json({
                message: "Email already taken"
            });
        }

        const applicationIds = await Promise.all(data.application.map(async (app) => {
            const createdApp = await Application.create({
                productId: app.productId,
                quantity: app.quantity,
                shipmentDate: app.shipmentDate
            });
            return createdApp._id; 
        }));

        const vendor = await Vendor.create({
            username: data.username,
            password: data.password,
            application: applicationIds,
            verified: false
        });

        const userId = vendor._id;

        await Account.create({
            userId,
            balance: 1 + Math.random() * 10000,
            accountType: "Vendor"
        });

        res.json({
            message: "Application request successful",
            vendor
        });
    } catch (error) {
        console.error("Error creating vendor:", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

module.exports = router;
