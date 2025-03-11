import { model, Schema, Types } from "mongoose";
import { dataHiding } from "./User.hooks.js";
import { addOTP, dateSchemaValidator } from "./User.methods.js";
import { decrypt } from "../../../utils/index.utils.js";
import {
  defaultCoverPic,
  defaultProfilePic,
  genders,
  otpTypes,
  providers,
  roles,
} from "../../../common/index.common.js";

//schema
const userSchema = new Schema(
  {
    firstName: { type: String, required: true },

    lastName: { type: String, required: true },

    email: { type: String, required: true },

    password: {
      type: String,
      required: function () {
        return this.provider === providers.SYSTEM;
      },
    },

    provider: {
      type: String,
      enum: Object.values(providers),
      default: providers.SYSTEM,
    },

    gender: { type: String, enum: Object.values(genders) },

    DOB: {
      type: Date,
      validate: {
        validator: dateSchemaValidator,
      },
    },

    profilePic: {
      secure_url: {
        type: String,
        required: true,
        default: defaultProfilePic.SECURE_URL,
      },
      public_id: {
        type: String,
        required: true,
        default: defaultProfilePic.PUBLIC_ID,
      },
    },

    coverPic: {
      secure_url: {
        type: String,
        required: true,
        default: defaultCoverPic.SECURE_URL,
      },
      public_id: {
        type: String,
        required: true,
        default: defaultCoverPic.PUBLIC_ID,
      },
    },

    mobileNumber: {
      type: String,
      transform: (v) => decrypt({ cipherData: v }),
    },

    role: { type: String, enum: Object.values(roles), default: roles.USER },

    isConfirmed: { type: Boolean, default: false },

    deletedAt: { type: Date },

    bannedAt: { type: Date },

    updatedBy: { type: Types.ObjectId, ref: "User" },

    //last change of password
    changeCredentialTime: { type: Date },

    OTP: [
      {
        otp: { type: String },
        type: {
          type: String,
          enum: Object.values(otpTypes),
          default: otpTypes.CONFIRM_EMAIL,
        },
        expiresIn: { type: Date },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//otp method
userSchema.methods.addOTP = addOTP;

//user name
userSchema.virtual("username").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre("save", dataHiding);

//model
const User = model("User", userSchema);

export default User;
