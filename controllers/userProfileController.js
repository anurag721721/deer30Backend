const User = require("../models/UserModel");
const Address = require("../models/addressModel");

const updateProfile = async (req, res) => {
  try {
    const { email, gender, dob, mobileNumber, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updateData = {};

    if (gender) updateData.gender = gender;
    if (dob) updateData.dob = dob;
    if (mobileNumber) updateData.mobileNumber = mobileNumber;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;

    // Update the user
    await User.updateOne({ email }, { $set: updateData });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error in updateProfile:", error); // Log the error for debugging
    return res.status(500).json({
      success: false,
      message:
        "An error occurred during profile update. Please try again later.",
    });
  }
};
const addAddress = async (req, res) => {
  try {
    const {
      user,
      name,
      addressLine,
      city,
      state,
      postalCode,
      country,
      phoneNumber,
    } = req.body;

    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Create the new address
    const newAddress = new Address({
      user,
      name,
      addressLine,
      city,
      state,
      postalCode,
      country,
      phoneNumber,
    });

    // Save the address to the database
    await newAddress.save();

    // Add the address to the user's address array
    existingUser.address.push(newAddress._id);
    await existingUser.save();

    return res.status(201).json({
      success: true,
      address: newAddress,
      message: "Address added successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the address",
    });
  }
};
const getAllAddressOfUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate("address");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      addresses: user.address,
      message: "All the address fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching addresses",
    });
  }
};
const updateAdress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { name, addressLine, city, state, postalCode, country, phoneNumber } =
      req.body;

    // Update the address
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { name, addressLine, city, state, postalCode, country, phoneNumber },
      { new: true } // Return the updated document
    );

    if (!updatedAddress) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    return res.status(200).json({ success: true, address: updatedAddress,message:"Address updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the address",
    });
  }
};
const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    // Find and delete the address
    const deletedAddress = await Address.findByIdAndDelete(addressId);

    if (!deletedAddress) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    // Also, remove the address reference from the user
    const user = await User.findOne({ address: addressId});
    if (user) {
      user.address.pull(addressId); // Removes the address from the user's address array
      await user.save();
    }

    return res
      .status(200)
      .json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the address",
    });
  }
};
module.exports = {
  updateProfile,
  addAddress,
  getAllAddressOfUser,
  updateAdress,
  deleteAddress,
};
