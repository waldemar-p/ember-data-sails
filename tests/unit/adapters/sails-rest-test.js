import { run } from '@ember/runloop';
import SailsRestAdapter from '@voll/ember-data-sails/adapters/sails-rest';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('SailsRestAdapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.subject = function (obj) {
      return run(SailsRestAdapter, 'create', obj || {});
    };
  });

  test('it has correct URL for the CSRF token', function (assert) {
    assert.expect(7);

    const adapter = this.subject();

    assert.strictEqual(
      adapter.get('csrfTokenUrl'),
      '/csrfToken',
      'default URL should be correct',
    );

    run(adapter, 'set', 'host', 'https://example.com');
    assert.strictEqual(
      adapter.get('csrfTokenUrl'),
      'https://example.com/csrfToken',
      'URL should be correct with `host` set',
    );

    run(adapter, 'set', 'namespace', 'api');
    assert.strictEqual(
      adapter.get('csrfTokenUrl'),
      'https://example.com/csrfToken',
      'URL should be correct with `host` and `namespace` set, absolute path',
    );

    run(adapter, 'set', 'csrfTokenPath', 'csrfToken');
    assert.strictEqual(
      adapter.get('csrfTokenUrl'),
      'https://example.com/api/csrfToken',
      'URL should be correct with `host` and `namespace` set, relative path',
    );

    run(adapter, 'set', 'host', null);
    assert.strictEqual(
      adapter.get('csrfTokenUrl'),
      '/api/csrfToken',
      'URL should be correct with `namespace` set, relative path',
    );

    run(adapter, 'set', 'csrfTokenPath', '/csrfToken');
    assert.strictEqual(
      adapter.get('csrfTokenUrl'),
      '/csrfToken',
      'URL should be correct with `namespace` set, absolute path',
    );

    run(adapter, 'set', 'host', '//example.com:1337');
    assert.strictEqual(
      adapter.get('csrfTokenUrl'),
      '//example.com:1337/csrfToken',
      'URL should be correct with `namespace` and `host` set, absolute path and protocol independent host',
    );
  });
});
