
CREATE DATABASE IF NOT EXISTS 3Dprojectdb
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE 3Dprojectdb;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS project_members;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS user_settings;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------
-- TABLES
-- ---------------------------------------------------------------

CREATE TABLE users (
    user_id        INT UNSIGNED NOT NULL AUTO_INCREMENT,
    first_name     VARCHAR(100) NOT NULL,
    last_name      VARCHAR(100) NOT NULL,
    email          VARCHAR(255) NOT NULL,
    password_hash  VARCHAR(255) NOT NULL,
    date_of_birth  DATE NULL,
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at  DATETIME NULL,
    is_active      TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (user_id),
    UNIQUE KEY ux_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE user_settings (
    setting_id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id              INT UNSIGNED NOT NULL,
    display_name         VARCHAR(100) NULL,
    job_title            VARCHAR(150) NULL,
    phone                VARCHAR(30) NULL,
    timezone             VARCHAR(50) NOT NULL DEFAULT 'UTC',
    gender               VARCHAR(30) NULL,
    avatar_url           VARCHAR(500) NULL,
    cover_url            VARCHAR(500) NULL,
    email_notifications  TINYINT(1) NOT NULL DEFAULT 1,
    deadline_reminders   TINYINT(1) NOT NULL DEFAULT 1,
    weekly_summary       TINYINT(1) NOT NULL DEFAULT 1,
    theme                VARCHAR(30) NOT NULL DEFAULT 'system',
    created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (setting_id),
    UNIQUE KEY ux_user_settings_user (user_id),
    CONSTRAINT fk_user_settings_user
        FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE projects (
    project_id    INT UNSIGNED NOT NULL AUTO_INCREMENT,
    owner_id      INT UNSIGNED NOT NULL,
    project_name  VARCHAR(150) NOT NULL,
    description   TEXT NULL,
    status        VARCHAR(30) NOT NULL DEFAULT 'active',
    start_date    DATE NULL,
    end_date      DATE NULL,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id),
    KEY ix_projects_owner (owner_id),
    CONSTRAINT fk_projects_owner
        FOREIGN KEY (owner_id) REFERENCES users (user_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE project_members (
    project_member_id  INT UNSIGNED NOT NULL AUTO_INCREMENT,
    project_id         INT UNSIGNED NOT NULL,
    user_id            INT UNSIGNED NOT NULL,
    role               VARCHAR(30) NOT NULL DEFAULT 'member',
    status             VARCHAR(30) NOT NULL DEFAULT 'active',
    joined_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_member_id),
    UNIQUE KEY ux_project_members_project_user (project_id, user_id),
    KEY ix_project_members_user (user_id),
    CONSTRAINT fk_project_members_project
        FOREIGN KEY (project_id) REFERENCES projects (project_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_project_members_user
        FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tasks (
    task_id       INT UNSIGNED NOT NULL AUTO_INCREMENT,
    project_id    INT UNSIGNED NOT NULL,
    assigned_to   INT UNSIGNED NULL,
    created_by    INT UNSIGNED NOT NULL,
    title         VARCHAR(200) NOT NULL,
    description   TEXT NULL,
    status        VARCHAR(30) NOT NULL DEFAULT 'todo',
    priority      VARCHAR(20) NOT NULL DEFAULT 'medium',
    due_date      DATE NULL,
    completed_at  DATETIME NULL,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (task_id),
    KEY ix_tasks_project (project_id),
    KEY ix_tasks_assigned_to (assigned_to),
    KEY ix_tasks_created_by (created_by),
    KEY ix_tasks_due_date (due_date),
    CONSTRAINT fk_tasks_project
        FOREIGN KEY (project_id) REFERENCES projects (project_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_tasks_assigned_to
        FOREIGN KEY (assigned_to) REFERENCES users (user_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_tasks_created_by
        FOREIGN KEY (created_by) REFERENCES users (user_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE notifications (
    notification_id    INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id            INT UNSIGNED NOT NULL,
    project_id         INT UNSIGNED NULL,
    task_id            INT UNSIGNED NULL,
    notification_type  VARCHAR(50) NOT NULL,
    message            TEXT NOT NULL,
    is_read            TINYINT(1) NOT NULL DEFAULT 0,
    created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (notification_id),
    KEY ix_notifications_user_read (user_id, is_read),
    KEY ix_notifications_project (project_id),
    KEY ix_notifications_task (task_id),
    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_notifications_project
        FOREIGN KEY (project_id) REFERENCES projects (project_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_notifications_task
        FOREIGN KEY (task_id) REFERENCES tasks (task_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE activity_logs (
    activity_id  INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id      INT UNSIGNED NOT NULL,
    project_id   INT UNSIGNED NULL,
    task_id      INT UNSIGNED NULL,
    action       VARCHAR(50) NOT NULL,
    description  TEXT NOT NULL,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (activity_id),
    KEY ix_activity_user (user_id),
    KEY ix_activity_project (project_id),
    KEY ix_activity_task (task_id),
    CONSTRAINT fk_activity_user
        FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_activity_project
        FOREIGN KEY (project_id) REFERENCES projects (project_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_activity_task
        FOREIGN KEY (task_id) REFERENCES tasks (task_id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;


INSERT INTO users
(first_name, last_name, email, password_hash, date_of_birth, is_active)
VALUES
('Joshua', 'Manong', 'joshua@example.com', 'DEMO_HASH', '2000-01-15', 1);

INSERT INTO user_settings
(user_id, display_name, job_title, phone, timezone, email_notifications, deadline_reminders, weekly_summary, theme)
VALUES
(1, 'Joshua Manong', 'Project Manager', '09171234567', 'Asia/Manila', 1, 1, 1, 'system');

INSERT INTO projects
(owner_id, project_name, description, status, start_date, end_date)
VALUES
(1, 'Website Development', 'Main project for the website system.', 'active', '2026-10-01', '2026-12-31');

INSERT INTO project_members
(project_id, user_id, role, status)
VALUES
(1, 1, 'owner', 'active');

INSERT INTO tasks
(project_id, assigned_to, created_by, title, description, status, priority, due_date)
VALUES
(1, 1, 1, 'Login Page', 'Design and implement the login screen.', 'todo', 'high', '2026-10-15');

INSERT INTO notifications
(user_id, project_id, task_id, notification_type, message, is_read)
VALUES
(1, 1, 1, 'task_created', 'A new task was created: Login Page', 0);

INSERT INTO activity_logs
(user_id, project_id, task_id, action, description)
VALUES
(1, 1, 1, 'task_created', 'Juan created the task Login Page.');
