import mongoose from "mongoose";
const { Schema } = mongoose;

const permissionsSchema = new Schema(
  {
    company: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        immutable: true,
      },
    },
    user: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        immutable: true,
      },
    },
    permissions: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true },
);

permissionsSchema.index({ "company._id": 1, "user._id": 1 }, { unique: true });

export const Permissions = mongoose.model(
  "permission_general",
  permissionsSchema,
);
