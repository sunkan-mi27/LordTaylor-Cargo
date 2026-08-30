import prisma from "../config/prisma.js";

export const getMySettings = async (req, res) => {
  try {
    const settings = await prisma.userSettings.upsert({
      where: {
        userId: req.user.id,
      },

      update: {},

      create: {
        userId: req.user.id,
      },
    });

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Get settings error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching your settings",
    });
  }
};

export const updateMySettings = async (req, res) => {
  try {
    const {
      shipmentUpdates,
      deliveryAlerts,
      promotionalEmails,
      language,
      timezone,
      theme,
    } = req.body;

    const settings = await prisma.userSettings.upsert({
      where: {
        userId: req.user.id,
      },

      update: {
        shipmentUpdates,
        deliveryAlerts,
        promotionalEmails,
        language,
        timezone,
        theme,
      },

      create: {
        userId: req.user.id,
        shipmentUpdates: shipmentUpdates ?? true,
        deliveryAlerts: deliveryAlerts ?? true,
        promotionalEmails: promotionalEmails ?? false,
        language: language ?? "English",
        timezone: timezone ?? "West Africa Time (WAT)",
        theme: theme ?? "Dark",
      },
    });

    res.json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Update settings error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while updating your settings",
    });
  }
};