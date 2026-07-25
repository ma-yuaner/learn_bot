import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const schemaPath = join(projectRoot, "db", "schema.sql");

const checker = String.raw`
import json
import sqlite3
import sys

schema = open(sys.argv[1], encoding="utf-8").read()
db = sqlite3.connect(":memory:")
db.executescript(schema)

tables = {
    row[0]
    for row in db.execute("SELECT name FROM sqlite_master WHERE type = 'table'")
}
required = {
    "learners", "devices", "course_versions", "lesson_progress",
    "code_submissions", "assessment_evidence", "sync_events"
}

db.execute("INSERT INTO learners (id, display_name) VALUES ('u1', '探险家')")
db.execute("INSERT INTO devices (id, learner_id, label) VALUES ('d1', 'u1', '手机')")
db.execute("INSERT INTO course_versions (course_id, version) VALUES ('python', 1)")
db.execute("""
    INSERT INTO lesson_progress
      (learner_id, lesson_id, course_id, course_version, status, mastery)
    VALUES ('u1', 'python-values-variables', 'python', 1, 'learning', 40)
""")

fresh = db.execute("""
    UPDATE lesson_progress
    SET mastery = 80, revision = revision + 1
    WHERE learner_id = 'u1' AND lesson_id = 'python-values-variables' AND revision = 1
""").rowcount
stale = db.execute("""
    UPDATE lesson_progress
    SET mastery = 20, revision = revision + 1
    WHERE learner_id = 'u1' AND lesson_id = 'python-values-variables' AND revision = 1
""").rowcount

db.execute("""
    INSERT INTO sync_events
      (id, learner_id, device_id, idempotency_key, entity_type, entity_id, client_revision, payload_json)
    VALUES ('e1', 'u1', 'd1', 'request-001', 'progress', 'python-values-variables', 1, '{}')
""")
duplicate_blocked = False
try:
    db.execute("""
        INSERT INTO sync_events
          (id, learner_id, device_id, idempotency_key, entity_type, entity_id, client_revision, payload_json)
        VALUES ('e2', 'u1', 'd1', 'request-001', 'progress', 'python-values-variables', 1, '{}')
    """)
except sqlite3.IntegrityError:
    duplicate_blocked = True

print(json.dumps({
    "tables": sorted(tables),
    "all_required": required.issubset(tables),
    "fresh_update": fresh,
    "stale_update": stale,
    "duplicate_blocked": duplicate_blocked,
}))
`;

test("学习档案数据模型支持版本冲突和幂等同步", () => {
  const result = spawnSync("python3", ["-c", checker, schemaPath], {
    cwd: projectRoot,
    encoding: "utf8",
    timeout: 3_000
  });
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.all_required, true);
  assert.equal(report.fresh_update, 1);
  assert.equal(report.stale_update, 0);
  assert.equal(report.duplicate_blocked, true);
});
