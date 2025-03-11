import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

export const generateToken = ({
  payload = {},
  secretKey = process.env.JWT_SECRET,
  options = {},
}) => {
  return jwt.sign(payload, secretKey, options);
};

export const verifyToken = ({ token, secretKey = process.env.JWT_SECRET }) => {
  return jwt.verify(token, secretKey);
};

export const verifyGoogleToken = async (idToken) => {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });
  return ticket.getPayload();
};
