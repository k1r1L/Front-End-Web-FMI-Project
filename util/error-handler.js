const errorHandler =  (errorMsg, renderView, res, oldValue) => {
  res.locals.globalError = {
      errorMsg: errorMsg,
      multipleMessages: Array.isArray(errorMsg)
  };

  res.render(renderView, oldValue);
};

const handleDbErrors = (e) => {
  let errors = Object.keys(e['errors']);
  let errorMessages = [];
  for (const err of errors) {
    errorMessages.push(`${e['errors'][err]}`);
  }

  return errorMessages;
}

module.exports = {
  errorHandler: errorHandler,
  handleDbErrors: handleDbErrors
};