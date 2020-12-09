import { FieldError, HTTP_ERROR, HttpError } from '../../config/error';

const validator = (schema, property) => {
  return async (req, res, next) => {
    try {
      await schema.validate(req[property], { stripUnknown: true, abortEarly: false });
      return next();
    } catch (validationErrors) {
      if (validationErrors.inner && validationErrors.inner. length) {
        const allErrors = validationErrors.inner.map(value =>  {
          const name = value.path;
          const code = value.message.replace(/"/g, '').replace(/ /g, '_').toUpperCase();
          const {message} = value;
          return new FieldError(name, code, message)
        });
        return res.status(400).json(allErrors);
      }
      return res.status(500).json(new HttpError(HTTP_ERROR.INTERNAL_SERVER_ERROR, 'validator_wrong'));
    }
  };
};

const validatorType = Object.freeze({
  BODY: 'body',
  PARAMS: 'params',
  QUERY: 'query'
});

export { validator, validatorType };
