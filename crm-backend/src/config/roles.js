const allRoles = {
  user: ['manageClient', 'manageTemplates'],
  manager: ['getUsers', 'managePayout', 'manageClient', 'manageTemplates'] ,
  admin: ['getUsers', 'manageUsers', 'managePayout', 'manageClient', 'manageTemplates'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
