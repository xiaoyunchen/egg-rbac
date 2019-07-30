'use strict';

module.exports = (mongoose, conn) => {

  const PermissionSchema = new mongoose.Schema({
    name: { type: String },
    alias: { type: String },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
  });

  return conn.model('Permission', PermissionSchema);
};
