const getError = (error) =>
  error?.response?.data?.message
    ? error?.response?.data?.message
    : error?.message;

export { getError };
