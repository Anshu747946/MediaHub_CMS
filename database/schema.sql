-- ============================================================
-- MediaHub CMS — MySQL 8 Database Schema
-- Run this FIRST before starting Spring Boot
-- ============================================================

CREATE DATABASE IF NOT EXISTS mediahub_cms
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mediahub_cms;

CREATE TABLE users (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(100)  NOT NULL UNIQUE,
    email         VARCHAR(255)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    role          ENUM('CONTENT_CREATOR','EDITOR','MARKETING','MANAGER','IT_SUPPORT') NOT NULL DEFAULT 'CONTENT_CREATOR',
    is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role  ON users(role);

CREATE TABLE content (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_by     BIGINT        NOT NULL,
    title          VARCHAR(500)  NOT NULL,
    description    TEXT,
    content_type   ENUM('ARTICLE','VIDEO','PODCAST','IMAGE') NOT NULL DEFAULT 'ARTICLE',
    status         ENUM('DRAFT','UNDER_REVIEW','APPROVED','SCHEDULED','PUBLISHED','REJECTED') NOT NULL DEFAULT 'DRAFT',
    body           LONGTEXT,
    media_url      VARCHAR(1000),
    tags           JSON,
    scheduled_at   DATETIME,
    published_at   DATETIME,
    created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
);
CREATE INDEX idx_content_status     ON content(status);
CREATE INDEX idx_content_created_by ON content(created_by);

CREATE TABLE approval_workflows (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    content_id   BIGINT   NOT NULL,
    assigned_to  BIGINT   NOT NULL,
    stage_order  INT      NOT NULL DEFAULT 1,
    stage_status ENUM('PENDING','APPROVED','REJECTED','CHANGES_REQUESTED') NOT NULL DEFAULT 'PENDING',
    comments     TEXT,
    actioned_at  DATETIME,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id)  REFERENCES content(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id)   ON DELETE RESTRICT
);
CREATE INDEX idx_workflow_content  ON approval_workflows(content_id);
CREATE INDEX idx_workflow_assigned ON approval_workflows(assigned_to);

CREATE TABLE channels (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(200) NOT NULL UNIQUE,
    platform_type ENUM('SOCIAL_MEDIA','BLOG','EMAIL_NEWSLETTER','RSS_FEED') NOT NULL,
    api_endpoint  VARCHAR(1000),
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_channels (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    content_id     BIGINT NOT NULL,
    channel_id     BIGINT NOT NULL,
    dist_status    ENUM('PENDING','SENT','FAILED') NOT NULL DEFAULT 'PENDING',
    distributed_at DATETIME,
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_content_channel (content_id, channel_id),
    FOREIGN KEY (content_id) REFERENCES content(id)  ON DELETE CASCADE,
    FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE
);

CREATE TABLE engagement_metrics (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    content_id     BIGINT NOT NULL,
    channel_id     BIGINT,
    views          INT    NOT NULL DEFAULT 0,
    likes          INT    NOT NULL DEFAULT 0,
    shares         INT    NOT NULL DEFAULT 0,
    comments_count INT    NOT NULL DEFAULT 0,
    metric_date    DATE   NOT NULL,
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_metrics_per_day (content_id, channel_id, metric_date),
    FOREIGN KEY (content_id) REFERENCES content(id)  ON DELETE CASCADE,
    FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE SET NULL
);
CREATE INDEX idx_metrics_content ON engagement_metrics(content_id);
CREATE INDEX idx_metrics_date    ON engagement_metrics(metric_date);

-- Seed data — password for all users: Test@1234
INSERT INTO users (username, email, password_hash, role) VALUES
('alice_creator',   'alice@mediahub.com',  '$2a$12$xWk3Dl8oMY2hDZyMHCEiQe5nTLa.fXl6g8cX1mYIqK3vCFLh7Aaqu', 'CONTENT_CREATOR'),
('bob_editor',      'bob@mediahub.com',    '$2a$12$xWk3Dl8oMY2hDZyMHCEiQe5nTLa.fXl6g8cX1mYIqK3vCFLh7Aaqu', 'EDITOR'),
('carol_marketing', 'carol@mediahub.com',  '$2a$12$xWk3Dl8oMY2hDZyMHCEiQe5nTLa.fXl6g8cX1mYIqK3vCFLh7Aaqu', 'MARKETING'),
('dave_manager',    'dave@mediahub.com',   '$2a$12$xWk3Dl8oMY2hDZyMHCEiQe5nTLa.fXl6g8cX1mYIqK3vCFLh7Aaqu', 'MANAGER'),
('eve_it',          'eve@mediahub.com',    '$2a$12$xWk3Dl8oMY2hDZyMHCEiQe5nTLa.fXl6g8cX1mYIqK3vCFLh7Aaqu', 'IT_SUPPORT');

INSERT INTO channels (name, platform_type, api_endpoint) VALUES
('Company Blog',      'BLOG',             'https://blog.mediahub.com/api/publish'),
('Twitter/X',         'SOCIAL_MEDIA',     'https://api.twitter.com/2/tweets'),
('LinkedIn',          'SOCIAL_MEDIA',     'https://api.linkedin.com/v2/shares'),
('Weekly Newsletter', 'EMAIL_NEWSLETTER', 'https://api.mailchimp.com/3.0/campaigns');
