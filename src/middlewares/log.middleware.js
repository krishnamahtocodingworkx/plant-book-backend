export const logMiddleware = async (req, res, next) => {
  console.log("----- API Request -----");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Body:", req.body);
  console.log("Params:", req.params);
  console.log("Query:", req.query);
  console.log("Time:", new Date().toISOString());
  console.log("-----------------------");
  next();
};
