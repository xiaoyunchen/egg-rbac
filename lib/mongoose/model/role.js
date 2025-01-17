'use strict';

module.exports = (mongoose, conn) => {
  const Schema = mongoose.Schema;
  const ObjectId = Schema.ObjectId;
  const RoleSchema = new mongoose.Schema({
    name: { type: String },
    alias: { type: String },
    desc: { type: String },
    grants: [{ type: ObjectId, ref: 'Permission' }],
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
  });

  return conn.model('Role', RoleSchema);
};
