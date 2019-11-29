'use strict';

const role = require('./model/role');
const permission = require('./model/permission');
const debug = require('debug')('egg-rbac');

module.exports = exports = class mongooseStorage {

  constructor(_mongoose, conn) {
    this._mongoose = _mongoose;
    this.Role = role(_mongoose, conn);
    this.Permission = permission(_mongoose, conn);
  }

  newRole({ name, alias, grants, desc }) {
    return this.Role.findOne({ name })
      .then(oldRole => {
        if (oldRole === null) {
          const newRole = new this.Role();
          newRole.name = name;
          newRole.alias = alias;
          newRole.grants = grants;
          newRole.desc = desc
          return newRole.save();
        }
        return null;
      });
  }

  newPermission({ name, alias, type, desc }) {
    return this.Permission.findOne({ name })
      .then(oldPermission => {
        if (oldPermission === null) {
          const newPermission = new this.Permission();
          newPermission.name = name;
          newPermission.alias = alias;
          newPermission.type = type
          newPermission.desc = desc
          return newPermission.save();
        }
        return null;
      });
  }

  modifyRole(_id, info) {
    return this.Role.updateOne({ _id }, { $set: info });
  }

  modifyPermission(_id, info) {
    return this.Permission.updateOne({ _id }, { $set: info });
  }

  removeRole(_id) {
    return this.Role.remove({ _id });
  }

  removePermission(_id) {
    return Promise.all([
      this.Permission.remove({ _id }),
      this.Role.update({}, { $pull: { grants: _id } }),
    ]);
  }

  addPermission(_id, permissionIds) {
    return this.Role.updateOne({ _id }, { $addToSet: { grants: { $each: permissionIds } } });
  }

  removePermissions(_id, permissionIds) {
    return this.Role.updateOne({ _id }, { $pull: { grants: { $in: permissionIds } } });
  }

  insertManyPermission(permissions) {
    return this.Permission.insertMany(permissions)
      .then(result => {
        return result.insertedIds;
      });
  }

  getRole(name) {
    return this.Role.findOne({ name }).populate('grants');
  }

  getAllRoles() {
    return this.Role.find({}).populate('grants');
  }

  getPermissions(names) {
    debug('getPermissions names = %O', names);
    return this.Permission.find({ name: { $in: names } });
  }

  getAllPermissions(type) {
    return this.Permission.find({ type });
  }

};
