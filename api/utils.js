
function requireUser(req, res, next) {
  if (!req.user) {
    return next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action.",
    });
  }

  return next();
}

function requireAdmin(req, res, next) {
  if (!req.user) {
    return next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action.",
    });
  }

  if (!req.user.admin) {
    return next({
      name: "PermissionsError",
      message: "You must have administrator access.",
    });
  }

  return next();
}

module.exports = {
  requireUser,
  requireAdmin,
};
