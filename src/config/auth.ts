export const authConfig = {
  public_jwt_secret: process.env.JWT_PUBLIC_KEY,
  public_refresh_secret: process.env.REFRESH_PUBLIC_KEY,
  expires_in_token: "15m",
  expires_in_refresh: "30d",
  expires_in_refresh_number: 30,
};
