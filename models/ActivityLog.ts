import mongoose from "mongoose";

export interface IActivityLog extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  entity: string;
  entityId?: mongoose.Types.ObjectId;
  details?: string;
  createdAt: Date;
}

const ActivityLogSchema = new mongoose.Schema<IActivityLog>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    details: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
