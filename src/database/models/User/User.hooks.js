import { encrypt, hash } from "../../../utils/index.utils.js";

export function dataHiding(next, doc) {
  if (this.isModified("password")) {
    this.password = hash({ data: this.password });
    this.changeCredentialTime = new Date();
  }

  if (this.isModified("mobileNumber"))
    this.mobileNumber = encrypt({ data: this.mobileNumber });

  return next();
}
