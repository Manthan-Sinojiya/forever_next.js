"use server";

import dbConnect from "@/lib/mongodb";
import ActivityLog from "@/models/ActivityLog";
// Need to import User so Mongoose registers the model

export async function getActivityLogs() {
  await dbConnect();
  // Populate the user who performed the action
  const logs = await ActivityLog.find({})
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .limit(500); // Prevent massive data loads

  return JSON.parse(JSON.stringify(logs));
}

// Helper function to log activities from other server actions
export async function logActivity(userId: string, action: string, entity: string, entityId?: string, details?: string) {
  try {
    await dbConnect();
    await ActivityLog.create({
      userId,
      action,
      entity,
      entityId,
      details,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
