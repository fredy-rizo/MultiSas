import { getIpInformation } from "../services/ip_query_services.js";

export default async function (req, res, next) {
  try {
    let ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      req.ip;

    console.log({
      ip: req.ip,
      remoteAddress: req.socket.remoteAddress,
      xForwardedFor: req.headers["x-forwarded-for"],
    });

    if (ip.startsWith("::ffff:")) {
      ip = ip.replace("::ffff:", "");
    }

    if (ip === "::1") ip = "127.0.0.1";

    req.ipInfo = await getIpInformation(ip);
  } catch (error) {
    console.error(error);
    req.ipInfo = null;
  }
  next();
}
