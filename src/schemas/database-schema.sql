-- ============================================================
--  Miss Emely — Esquema de base de datos (propuesta backend)
--  Motor sugerido: PostgreSQL 14+
--  Este archivo es documentación/planeación: hoy el frontend
--  usa datos hardcodeados y localStorage, pero las tablas están
--  diseñadas para reflejar 1:1 los DTOs en dtos.md
-- ============================================================

CREATE TYPE user_role AS ENUM ('teacher', 'student', 'admin');

-- ------------------------------------------------------------
-- users: docentes y alumnos que acceden a la plataforma
-- ------------------------------------------------------------
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(40)  NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,          -- hash (bcrypt/argon2), nunca texto plano
    full_name       VARCHAR(120) NOT NULL,
    role            user_role    NOT NULL,
    grade           VARCHAR(40),                    -- ej. "1° Grado A", null para docentes
    avatar_emoji    VARCHAR(8)   DEFAULT '🙂',
    avatar_color    VARCHAR(9)   DEFAULT '#4A90E2',  -- hex color
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- classrooms: (opcional/futuro) agrupa alumnos por sección
-- ------------------------------------------------------------
CREATE TABLE classrooms (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(60) NOT NULL,           -- ej. "1° Grado A"
    teacher_id      UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE classroom_students (
    classroom_id    UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    student_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (classroom_id, student_id)
);

-- ------------------------------------------------------------
-- activities: agenda/calendario de actividades publicadas
--             por la maestra para un día específico
-- ------------------------------------------------------------
CREATE TABLE activities (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id    UUID REFERENCES classrooms(id) ON DELETE SET NULL,
    author_id       UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    activity_date   DATE NOT NULL,                  -- día de la agenda (no de publicación)
    title           VARCHAR(120) NOT NULL,
    description     TEXT NOT NULL,
    image_url       TEXT,                           -- URL en storage (S3/Cloud Storage), null si no hay foto
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activities_date ON activities (activity_date DESC);
CREATE INDEX idx_activities_author ON activities (author_id);

-- ------------------------------------------------------------
-- activity_comments: comentarios de alumnos/docente bajo
--                     cada actividad
-- ------------------------------------------------------------
CREATE TABLE activity_comments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id     UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    author_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text            VARCHAR(500) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_activity ON activity_comments (activity_id, created_at);

-- ------------------------------------------------------------
-- sessions: (opcional) si se maneja sesión server-side en vez
--           de JWT stateless
-- ------------------------------------------------------------
CREATE TABLE sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token           VARCHAR(255) NOT NULL UNIQUE,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
