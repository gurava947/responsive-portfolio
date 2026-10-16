export function notFoundHandler(_request, response) {
  response.status(404).json({ error: { code: "NOT_FOUND", message: "API route not found." } });
}

export function errorHandler(error, _request, response, _next) {
  const status = Number.isInteger(error.status) && error.status >= 400 && error.status <= 599
    ? error.status
    : error.type === "entity.too.large" ? 413 : 500;
  if (status >= 500) console.error("API request failed.", error);
  const message = status >= 500 ? "The local API could not complete the request." : error.message;
  response.status(status).json({
    error: {
      code: status === 500 ? "INTERNAL_ERROR" : status === 413 ? "PAYLOAD_TOO_LARGE" : "REQUEST_ERROR",
      message,
    },
  });
}
