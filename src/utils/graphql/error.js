export const error = (error) => {
  return {
    stack: error.stack,
    success: false,
    status: error.originalError?.cause || 500,
    message: error.originalError?.message || error.message,
  };
};
