module.export = function ForbiddenError(message = 'Nao tem acesso ao recurso solicitado') {
  this.name = 'forbiddenError';
  this.message = message;
};
