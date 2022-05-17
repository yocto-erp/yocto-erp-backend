import passport from "passport";
import { HTTP_ERROR, HttpError } from "../../config/error";

export const passportJWT = () => passport.authenticate("jwt", { session: false });

export function isAuthenticated() {
  return [passportJWT(), (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      throw new HttpError(HTTP_ERROR.NOT_AUTHENTICATE, "Not Authenticated", null);
    }
  }];
}

export function hasPermission(permission) {
  return [isAuthenticated(), (req, res, next) => {
    const { permissions } = req.user;
    let isValid = true;
    if (permissions) {
      let checkPermissions = [];
      if (Array.isArray(permission)) {
        checkPermissions = permission;
      } else {
        checkPermissions = [permission];
      }
      for (let i = 0; i < checkPermissions.length; i += 1) {
        const _item = checkPermissions[i];
        if (!Object.prototype.hasOwnProperty.call(permissions, `action${_item}`)) {
          isValid = false;
          break;
        }
      }
    } else {
      isValid = false;
    }
    if (isValid) {
      next();
    } else {
      throw new HttpError(HTTP_ERROR.ACCESS_DENIED, "AccessDenied", "You have not permission to do this.");
    }
  }];
}

export function hasAnyPermission(permission) {
  return [isAuthenticated(), (req, res, next) => {
    const { permissions } = req.user;
    let isValid = false;
    if (permissions) {
      let checkPermissions = [];
      if (Array.isArray(permission)) {
        checkPermissions = permission;
      } else {
        checkPermissions = [permission];
      }
      for (let i = 0; i < checkPermissions.length; i += 1) {
        const _item = checkPermissions[i];
        if (Object.prototype.hasOwnProperty.call(permissions, `action${_item}`)) {
          isValid = true;
          break;
        }
      }
    }
    if (isValid) {
      next();
    } else {
      throw new HttpError(HTTP_ERROR.ACCESS_DENIED);
    }
  }];
}

export function isUserHasAnyPermission(user, ...checkPermissions) {
  const { permissions } = user;
  if (permissions) {
    for (let i = 0; i < checkPermissions.length; i += 1) {
      const _item = checkPermissions[i];
      if (Object.prototype.hasOwnProperty.call(permissions, `action${_item}`)) {
        return true;
      }
    }
  }
  return false;
}
