PRAGMA foreign_keys = ON;

CREATE TABLE learners (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE devices (
  id TEXT PRIMARY KEY,
  learner_id TEXT NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE course_versions (
  course_id TEXT NOT NULL,
  version INTEGER NOT NULL CHECK (version > 0),
  published_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (course_id, version)
);

CREATE TABLE lesson_progress (
  learner_id TEXT NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  course_version INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('not_started', 'learning', 'passed')),
  mastery INTEGER NOT NULL DEFAULT 0 CHECK (mastery BETWEEN 0 AND 100),
  revision INTEGER NOT NULL DEFAULT 1 CHECK (revision > 0),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (learner_id, lesson_id),
  FOREIGN KEY (course_id, course_version) REFERENCES course_versions(course_id, version)
);

CREATE TABLE code_submissions (
  id TEXT PRIMARY KEY,
  learner_id TEXT NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  challenge_id TEXT NOT NULL,
  source_code TEXT NOT NULL,
  result_json TEXT NOT NULL,
  passed INTEGER NOT NULL CHECK (passed IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assessment_evidence (
  id TEXT PRIMARY KEY,
  learner_id TEXT NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  evidence_type TEXT NOT NULL CHECK (evidence_type IN ('quiz', 'code', 'explanation', 'project', 'oral')),
  score INTEGER CHECK (score BETWEEN 0 AND 100),
  payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sync_events (
  id TEXT PRIMARY KEY,
  learner_id TEXT NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  idempotency_key TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  client_revision INTEGER NOT NULL CHECK (client_revision >= 0),
  payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (learner_id, idempotency_key)
);

CREATE INDEX idx_submissions_learner_lesson
  ON code_submissions (learner_id, lesson_id, created_at);

CREATE INDEX idx_evidence_learner_lesson
  ON assessment_evidence (learner_id, lesson_id, created_at);

CREATE INDEX idx_sync_events_entity
  ON sync_events (learner_id, entity_type, entity_id, created_at);
