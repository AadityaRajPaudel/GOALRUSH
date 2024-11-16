// global error handler function

export const errorThrower = (message) => {
  const err = new Error();
  err.success = false;
  err.message = message;
  return err;
};
