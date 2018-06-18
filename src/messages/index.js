import badRequest from './errors/400.json';
import unauthorized from './errors/401.json';
import notFound from './errors/404.json';
import timeout from './errors/408.json';
import submitted from './submitted.json';

export { submitted as SubmittedMessages };
export { badRequest as BadRequestMessages };
export { unauthorized as UnauthorizedMessages };
export { notFound as NotFoundMessages };
export { timeout as TimeoutMessages };

const ErrorMessages = {
  badRequest,
  unauthorized,
  notFound,
  timeout,
};

export { ErrorMessages };

export default {
  submitted,
  errors: ErrorMessages,
};
