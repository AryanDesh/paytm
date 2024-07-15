const { Router } = require('express');
const { Admin, Vendor, Application} = require('../db');
const {JWT_SECRET} = require('../config');
const {adminMiddleware} = require('../adminMiddleware');
const jwt = require('jsonwebtoken');
const zod = require('zod'); 
const { default: mongoose } = require('mongoose');
const router = Router();

const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

router.post('/signin' , async(req, res) => {
    const { success } = signinBody.safeParse(req.body);
    if(!success) {
        res.status(404).json({
            message : "Invalid Email or password"
        })
    }  
    const isAdmin = await Admin.findOne({
        username : req.body.username,
        password : req.body.password
    })
    if(!isAdmin) {
        return res.status(411).json({
            message : "Admin not available"
        })
    }
    const token = jwt.sign({
        userId : isAdmin._id,
    }, JWT_SECRET);

    res.json({
        token : token
    })
    return;
})

router.get('/get-vendor-applications' , async(req,res) => {
    const { username } = req.body;
    const isVendor = await Vendor.findOne({
        username : username
    }) 
    if(!isVendor) {
        return res.status(403).json({
            message: "vendor not available"
        })
    }
    const vendorApplication = isVendor.application;
    const application = await Application.findOne({
        userId: vendorApplication.productId
    })
    return res.json(application);
    
})

router.get('/get-vendor-status' , async(req,res) => {
    const { username } = req.body;
    const isVendor = await Vendor.findOne({
        username : username
    }) 
    if(!isVendor) {
        return res.status(403).json({
            message: "vendor not available"
        })
    }
    return res.json(isVendor.verified);
    
})

router.get('/allvendors', async(req, res) => {
    const vendors = await Vendor.find({}, '_id username').exec();
    const vendorInfo = vendors.map(vendor => ({
      id: vendor._id,
      username: vendor.username
    }));

    return res.json(vendorInfo);
})
router.put('/vendorValid', adminMiddleware, async (req, res) => {
    const { username } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const isVendor = await Vendor.findOne({ username }).session(session);

        if (!isVendor) {
            await session.abortTransaction();
            return res.status(403).json({
                message: "Vendor not available"
            });
        }

            await Vendor.updateOne(
            { _id: isVendor._id }, 
            {
                $set: {
                    verified: true,
                    availability: isVendor.application[0].quantity 
                }
            }
        ).session(session);

        const token = jwt.sign({ userId: isVendor._id }, JWT_SECRET);

        await session.commitTransaction();

        res.json({
            message: "Vendor has been approved",
            token: token
        });
    } catch (error) {
        console.error("Error approving vendor:", error);
        await session.abortTransaction();
        res.status(500).json({
            message: "Failed to approve vendor"
        });
    } finally {
        session.endSession();
    }
});

router.put('/vendor-discontinue', adminMiddleware, async (req, res) => {
    const { username } = req.body;

    try {
        const isVendor = await Vendor.findOne({ username });

        if (!isVendor) {
            return res.status(403).json({
                message: "Vendor not available"
            });
        }
        const userId = isVendor._id;
        await Vendor.updateOne(
            { _id: userId }, 
            {
                $set: {
                    verified: false,
                    availability: null
                }
            }
        );
        const token = jwt.sign({ userId }, JWT_SECRET);

        res.json({
            message: "Vendor has been blocked",
        });
    } catch (error) {
        console.error("Error blocking vendor:", error);
        res.status(500).json({
            message: "Failed to block vendor"
        });
    }
});


const signupBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
      const admin = await Admin.create({
        username: req.body.username,
        password: req.body.password,
      })
      const userId = Admin._id;
      const token = jwt.sign({
        userId
      }, JWT_SECRET);
      res.json({
        token : token
      })
})

module.exports = router;
