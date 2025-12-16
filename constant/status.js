export default {
  // 2xx Success Codes
  200: "OK - Success",
  201: "Created - Resource successfully created",
  202: "Accepted - Request accepted for processing, but not completed",
  204: "No Content - Request succeeded, no content returned",

  // 4xx Client Error Codes
  400: "Bad Request - The server could not understand the request due to invalid syntax",
  401: "Unauthorized - Authentication is required or has failed",
  403: "Forbidden - You do not have permission to access the resource",
  404: "Not Found - The requested resource could not be found",
  405: "Method Not Allowed - The requested method is not supported for the resource",
  406: "Not Acceptable - The requested resource is only capable of generating content not acceptable by the client",
  408: "Request Timeout - The server timed out waiting for the request",
  409: "Conflict - There is a conflict with the current state of the resource",
  410: "Gone - The resource requested is no longer available and will not be available again",
  411: "Length Required - The request did not specify the length of its content, which is required by the requested resource",
  412: "Precondition Failed - One or more conditions given in the request header fields were not met",
  413: "Payload Too Large - The request is larger than the server is willing or able to process",
  414: "URI Too Long - The URI provided was too long for the server to process",
  415: "Unsupported Media Type - The media format of the requested data is not supported by the server",
  416: "Range Not Satisfiable - The client has asked for a portion of the file, but the server cannot supply that portion",
  417: "Expectation Failed - The server cannot meet the requirements of the Expect request-header field",
  426: "Upgrade Required - The client should switch to a different protocol",
  429: "Too Many Requests - The user has sent too many requests in a given amount of time",

  // 5xx Server Error Codes
  500: "Internal Server Error - The server encountered an unexpected condition",
  501: "Not Implemented - The server does not support the functionality required to fulfill the request",
  502: "Bad Gateway - The server, while acting as a gateway, got an invalid response",
  503: "Service Unavailable - The server is not ready to handle the request (overload or maintenance)",
  504: "Gateway Timeout - The server, acting as a gateway, did not get a response in time",
  505: "HTTP Version Not Supported - The server does not support the HTTP protocol version used in the request",

  // Additional Common Status Codes (Optional)
  100: "Continue - The server has received the request headers, and the client should proceed to send the request body",
  101: "Switching Protocols - The requester has asked the server to switch protocols, and the server is acknowledging that it will do so",
  102: "Processing - The server has received the request and is processing it, but no response is available yet",
  207: "Multi-Status - WebDAV; multiple status codes for multiple operations",
  226: "IM Used - The server fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance",
  418: "I'm a Teapot - Defined in RFC 2324, for humorous purposes",
  451: "Unavailable For Legal Reasons - The resource is unavailable due to legal demands",
};
