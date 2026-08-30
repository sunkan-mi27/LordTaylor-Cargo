import prisma from "../config/prisma.js";

/* =========================================================
   EMAIL HOOK (NOT YET IMPLEMENTED)
   When you're ready to add real email delivery, implement
   this one function (e.g. with nodemailer, Resend, or
   SendGrid). Every call site below already passes through
   here, so email will start firing everywhere at once —
   no other file needs to change.
========================================================= */

const sendEmail = async ({ to, subject, message }) => {
  // Not yet implemented — in-app notifications only for now.
  return;
};

/* =========================================================
   NOTIFY A SINGLE USER
========================================================= */

export const notifyUser = async (userId, title, message, options = {}) => {
  try {
    if (!userId) return;

    await prisma.notification.create({
      data: { userId, title, message, link: options.link || null },
    });

    if (options.email) {
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (user?.email) {
        await sendEmail({ to: user.email, subject: title, message });
      }
    }
  } catch (error) {
    // Notification failures should never break the calling flow
    // (booking, payment, etc.) — log and move on.
    console.error("notifyUser error:", error.message);
  }
};

/* =========================================================
   NOTIFY ALL ADMINS
========================================================= */

export const notifyAdmins = async (title, message, options = {}) => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true, email: true },
    });

    if (admins.length === 0) return;

    await prisma.notification.createMany({
      data: admins.map((admin) => ({
        userId: admin.id,
        title,
        message,
        link: options.link || null,
      })),
    });

    if (options.email) {
      for (const admin of admins) {
        if (admin.email) {
          await sendEmail({ to: admin.email, subject: title, message });
        }
      }
    }
  } catch (error) {
    console.error("notifyAdmins error:", error.message);
  }
};
