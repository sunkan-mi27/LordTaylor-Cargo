import prisma from "../config/prisma.js";

export const getMyProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        profile: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching your profile",
    });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      country,
      city,
      avatarUrl,
      addressLine,
      state,
      postalCode,
      addressType,
      deliveryPreference,
    } = req.body;

    const profile = await prisma.profile.upsert({
      where: {
        userId: req.user.id,
      },
      update: {
        firstName,
        lastName,
        phone,
        country,
        city,
        avatarUrl,
        addressLine,
        state,
        postalCode,
        addressType,
        deliveryPreference,
      },
      create: {
        userId: req.user.id,
        firstName,
        lastName,
        phone,
        country,
        city,
        avatarUrl,
        addressLine,
        state,
        postalCode,
        addressType,
        deliveryPreference,
      },
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while updating your profile",
    });
  }
};
