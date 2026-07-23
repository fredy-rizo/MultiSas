import mongoose from "mongoose";
const { Schema } = mongoose;

const ipAddressSchema = new Schema(
  {
    ip: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    isp: {
      asn: String,
      org: String,
      isp: String,
    },
    location: {
      country: String,
      country_code: String,
      city: String,
      state: String,
      zipcode: String,
      latitude: Number,
      longitude: Number,
      timezone: String,
      localtime: String,
    },
    risk: {
      is_mobile: Boolean,
      is_vpn: Boolean,
      ir_tor: Boolean,
      is_proxy: Boolean,
      is_datacenter: Boolean,
      risk_score: Number,
    },
    last_lookup: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export const IpAddress = mongoose.model("ip_address", ipAddressSchema);
