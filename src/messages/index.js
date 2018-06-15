import notFound from './errors/404.json';
import unauthorized from './errors/401.json';
import submitted from './submitted.json';

export { submitted as SubmittedMessages };
export { notFound as NotFoundMessages };
export { unauthorized as UnauthorizedMessages };

const ErrorMessages = { notFound, unauthorized };
export { ErrorMessages };

export default {
  submitted,
  errors: {
    notFound,
    unauthorized,
  },
};
