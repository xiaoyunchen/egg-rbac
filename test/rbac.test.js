'use strict';

const request = require('supertest');
const mm = require('egg-mock');
const assert = require('assert');

describe('test/rbac.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/rbac-test',
    });
    // 等待 app 启动成功，才能执行测试用例
    return app.ready();
  });

  after(() => app.close());
  afterEach(mm.restore);

  it('should GET /admin 200 when role is admin', function* () {
    return app.httpRequest()
      .get('/admin?role=admin')
      .expect(200, 'success');
  });

  it('should GET /admin 404 when role is undefined', function* () {
    return app.httpRequest()
      .get('/admin')
      .expect(401, 'Unauthorized');
  });
});
