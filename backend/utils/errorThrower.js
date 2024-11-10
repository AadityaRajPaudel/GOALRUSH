export const errorThrower = (message, statusCode) => {
  err = new Error();
  err.message = message;
  err.statusCode = statusCode;
  err.success = false;
  return err;
};
