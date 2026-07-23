import axios from "axios";
import { BASE_URL, CACHE_TIME } from "../config/ipquery.js";
import { IpAddress } from "../../../modules/general/models/IpAddress.js";

export async function getIpInformation(ip) {
  const cached = await IpAddress.findOne({ ip });

  if (cached) {
    const expired = Date.now() - cached.last_lookup.getTime() > CACHE_TIME;

    if (!expired) return cached;
  }

  const { data } = await axios.get(`${BASE_URL}/${ip}`);
  const saved = await IpAddress.findOneAndUpdate(
    { ip },
    {
      ip: data.ip,
      isp: data.isp,
      location: data.location,
      risk: data.risk,
      last_lookup: new Date(),
    },
    {
      upsert: true,
      new: true,
    },
  );
  return saved;
}
