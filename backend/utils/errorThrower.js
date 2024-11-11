// global error handler function

export const errorThrower = (message) => {
  const err = new Error();
  err.message = message;
  err.success = false;
  return err;
};
