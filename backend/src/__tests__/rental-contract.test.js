import test from 'node:test';
import assert from 'node:assert/strict';
import { RentalSession } from '../models/RentalSession.js';

test('rental session records support the status contract used by the app', () => {
  const statusPath = RentalSession.schema.paths.status;
  assert.ok(statusPath, 'status should exist on RentalSession');
  assert.deepEqual(statusPath.options.enum, ['active', 'completed', 'reserved']);
  assert.ok(RentalSession.schema.paths.rentalStatus, 'legacy rentalStatus field should remain for compatibility');
});
