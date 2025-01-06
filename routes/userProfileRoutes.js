const express = require("express");
const { updateProfile, addAddress, getAllAddressOfUser, updateAdress,deleteAddress } = require("../controllers/userProfileController");
const router = express.Router();

router.patch("/updateProfile", updateProfile);
router.post("/addAddress", addAddress);
router.get("/getAllAddressOfUser/:userId", getAllAddressOfUser);
router.get("/updateAddressOfUser", updateAdress);
router.delete("/deleteAddressOfUser", deleteAddress);

module.exports = router;
