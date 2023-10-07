import * as yup from "yup";

const passRule =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerSchema = yup.object().shape({
  text: yup
  .string(),
  email: yup
    .string(),
    // .email("Please enter a valid email")
    // .required("This field is required"),
  password: yup
    .string()
    // .min(8)
    // .matches(passRule, { message: "Please enter a stronger password" })
    .required("This field is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), ""], "Password must match")
    .required("This field is required"),
});

export const resetSchema = yup.object().shape({
  text: yup
  .string(),
  email: yup
    .string()
    // .email("Please enter a valid email")
    // .required("This field is required"),
});

export const loginSchema = yup.object().shape({
  userName: yup
    .string(),
    // .email("Please enter a valid email")
    // .required("This field is required"),
  password: yup.string()
  // .min(8)
  .required("This field is required"),
});

export const forgotSchema = yup.object().shape({
  email: yup
    .string()
    .required("This field is required"),
    // .email("Please enter a valid email")
    // .required("This field is required"),
  // otp: yup.number()
  // // .min(8)
  // .required("This field is required"),
});


export const forgotOTPSchema = yup.object().shape({
  otp: yup
    .number()
    .required("This field is required"),
    // .email("Please enter a valid email")
    // .required("This field is required"),
  // otp: yup.number()
  // // .min(8)
  // .required("This field is required"),
});


export const changePasswordSchema = yup.object().shape({
  password: yup
    .string()
    // .min(8)
    // .matches(passRule, { message: "Please enter a stronger password" })
    .required("This field is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), ""], "Password must match")
    .required("This field is required"),
});