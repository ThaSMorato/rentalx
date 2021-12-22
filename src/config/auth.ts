export const authConfig = {
  public_jwt_secret:
    process.env.JWT_PUBLIC_KEY || "test_key_12309j1231872h31927u",
  public_refresh_secret:
    process.env.REFRESH_PUBLIC_KEY || "test_key_1230838d6gawd7asgd976",
  expires_in_token: "15m",
  expires_in_refresh: "30d",
  expires_in_refresh_number: 30,
};
