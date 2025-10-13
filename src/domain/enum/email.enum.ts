export enum OtpTypeEnum {
  SIGNUP = "sign-up",
  CHANGE_PASSWORD = "change-password",
  CHANGE_EMAIL = "change-email",
}

const user1_permission = [OtpTypeEnum.SIGNUP];

const user2_permission = [OtpTypeEnum.SIGNUP, OtpTypeEnum.CHANGE_PASSWORD];

if (user1_permission.includes(OtpTypeEnum.CHANGE_PASSWORD)) {
}
