// responseHandler.js
export default {
  success: (res, message, data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
      status: "Success",
      message,
      data,
    });
  },

  error: (res, message, error = null, statusCode = 500) => {
    return res.status(statusCode).json({
      status: "Error",
      message,
      error,
    });
  },

  validationError: (res, message, statusCode = 400) => {
    return res.status(statusCode).json({
      status: "Validation Error",
      message,
    });
  },

  unauthorized: (res, message = "Unauthorized", statusCode = 401) => {
    return res.status(statusCode).json({
      status: "Unauthorized",
      message,
    });
  },

  notFound: (res, message = "Not Found", statusCode = 404) => {
    return res.status(statusCode).json({
      status: "Not Found",
      message,
    });
  },
};
