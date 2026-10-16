PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE CHECK (length(trim(name)) BETWEEN 1 AND 120),
  display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1))
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY CHECK (length(id) BETWEEN 1 AND 100 AND id NOT GLOB '*[^a-z0-9-]*'),
  title TEXT NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 240),
  category_id INTEGER NOT NULL REFERENCES categories(id) ON UPDATE CASCADE,
  category TEXT NOT NULL CHECK (length(trim(category)) BETWEEN 1 AND 120),
  description TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  component_key TEXT NOT NULL CHECK (length(component_key) BETWEEN 1 AND 120),
  display_order INTEGER NOT NULL UNIQUE CHECK (display_order >= 0),
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS project_technologies (
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  technology TEXT NOT NULL CHECK (length(trim(technology)) BETWEEN 1 AND 100),
  display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  PRIMARY KEY (project_id, technology),
  UNIQUE (project_id, display_order)
);

CREATE TABLE IF NOT EXISTS project_data (
  project_id TEXT PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  data_json TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(data_json) AND json_type(data_json) = 'object')
);

CREATE TABLE IF NOT EXISTS theme_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  mode TEXT NOT NULL DEFAULT 'light' CHECK (mode IN ('light', 'dark')),
  primary_color TEXT NOT NULL DEFAULT '#6d5ce8' CHECK (primary_color GLOB '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]'),
  secondary_color TEXT NOT NULL DEFAULT '#0891b2' CHECK (secondary_color GLOB '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]'),
  accent_color TEXT NOT NULL DEFAULT '#db2777' CHECK (accent_color GLOB '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]'),
  background_color TEXT NOT NULL DEFAULT '#f1f5fb' CHECK (background_color GLOB '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]'),
  text_color TEXT NOT NULL DEFAULT '#18231d' CHECK (text_color GLOB '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]'),
  muted_color TEXT NOT NULL DEFAULT '#66725d' CHECK (muted_color GLOB '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]')
);

CREATE TABLE IF NOT EXISTS card_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  radius_top_left REAL NOT NULL DEFAULT 22 CHECK (radius_top_left BETWEEN 0 AND 40),
  radius_top_right REAL NOT NULL DEFAULT 22 CHECK (radius_top_right BETWEEN 0 AND 40),
  radius_bottom_right REAL NOT NULL DEFAULT 22 CHECK (radius_bottom_right BETWEEN 0 AND 40),
  radius_bottom_left REAL NOT NULL DEFAULT 22 CHECK (radius_bottom_left BETWEEN 0 AND 40),
  border_top INTEGER NOT NULL DEFAULT 1 CHECK (border_top BETWEEN 0 AND 8),
  border_right INTEGER NOT NULL DEFAULT 1 CHECK (border_right BETWEEN 0 AND 8),
  border_bottom INTEGER NOT NULL DEFAULT 1 CHECK (border_bottom BETWEEN 0 AND 8),
  border_left INTEGER NOT NULL DEFAULT 1 CHECK (border_left BETWEEN 0 AND 8),
  border_color TEXT NOT NULL DEFAULT '#c8d1c1' CHECK (border_color GLOB '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]'),
  border_top_color TEXT NOT NULL DEFAULT '#dfe8d9' CHECK (border_top_color GLOB '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]'),
  border_right_color TEXT NOT NULL DEFAULT '#dfe8d9' CHECK (border_right_color GLOB '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]'),
  border_bottom_color TEXT NOT NULL DEFAULT '#dfe8d9' CHECK (border_bottom_color GLOB '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]'),
  border_left_color TEXT NOT NULL DEFAULT '#dfe8d9' CHECK (border_left_color GLOB '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]'),
  background_color TEXT NOT NULL DEFAULT '#ffffff' CHECK (background_color GLOB '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]'),
  text_color TEXT NOT NULL DEFAULT '#18231d' CHECK (text_color GLOB '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]'),
  font_family TEXT NOT NULL DEFAULT 'arial' CHECK (font_family IN ('theme', 'system', 'arial', 'georgia', 'monospace')),
  max_width INTEGER NOT NULL DEFAULT 520 CHECK (max_width BETWEEN 240 AND 520),
  min_height INTEGER NOT NULL DEFAULT 0 CHECK (min_height BETWEEN 0 AND 600),
  mobile_image_height INTEGER NOT NULL DEFAULT 160 CHECK (mobile_image_height BETWEEN 120 AND 240),
  tablet_image_height INTEGER NOT NULL DEFAULT 175 CHECK (tablet_image_height BETWEEN 140 AND 280),
  desktop_image_height INTEGER NOT NULL DEFAULT 190 CHECK (desktop_image_height BETWEEN 160 AND 320),
  font_size INTEGER NOT NULL DEFAULT 16 CHECK (font_size BETWEEN 12 AND 24),
  font_weight INTEGER NOT NULL DEFAULT 600 CHECK (font_weight BETWEEN 300 AND 800 AND font_weight % 100 = 0),
  hover_scale REAL NOT NULL DEFAULT 1.02 CHECK (hover_scale BETWEEN 1 AND 1.04),
  hover_highlight TEXT NOT NULL DEFAULT 'medium' CHECK (hover_highlight IN ('none', 'subtle', 'medium')),
  transition_duration INTEGER NOT NULL DEFAULT 275 CHECK (transition_duration BETWEEN 0 AND 600),
  transition_easing TEXT NOT NULL DEFAULT 'standard' CHECK (transition_easing IN ('smooth', 'standard'))
);

CREATE TABLE IF NOT EXISTS animation_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  entrance_mode TEXT NOT NULL DEFAULT 'none' CHECK (entrance_mode IN ('none', 'subtle', 'medium')),
  scroll_reveal INTEGER NOT NULL DEFAULT 0 CHECK (scroll_reveal IN (0, 1)),
  click_feedback INTEGER NOT NULL DEFAULT 1 CHECK (click_feedback IN (0, 1)),
  preview_switch INTEGER NOT NULL DEFAULT 1 CHECK (preview_switch IN (0, 1)),
  animation_intensity TEXT NOT NULL DEFAULT 'smooth' CHECK (animation_intensity IN ('none', 'subtle', 'smooth', 'expressive')),
  reduced_motion INTEGER NOT NULL DEFAULT 0 CHECK (reduced_motion IN (0, 1))
);

CREATE TABLE IF NOT EXISTS preview_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  small_width INTEGER NOT NULL DEFAULT 360 CHECK (small_width BETWEEN 240 AND 480),
  small_height INTEGER NOT NULL DEFAULT 640 CHECK (small_height BETWEEN 320 AND 960),
  medium_width INTEGER NOT NULL DEFAULT 768 CHECK (medium_width BETWEEN 480 AND 1024),
  medium_height INTEGER NOT NULL DEFAULT 1024 CHECK (medium_height BETWEEN 600 AND 1400),
  large_width INTEGER NOT NULL DEFAULT 1200 CHECK (large_width BETWEEN 800 AND 1920),
  large_height INTEGER NOT NULL DEFAULT 760 CHECK (large_height BETWEEN 500 AND 1200)
);

CREATE INDEX IF NOT EXISTS idx_projects_active ON projects(active);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_category_id ON projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);
CREATE INDEX IF NOT EXISTS idx_project_technologies_project_id ON project_technologies(project_id);
CREATE INDEX IF NOT EXISTS idx_project_data_project_id ON project_data(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at);

CREATE TRIGGER IF NOT EXISTS projects_category_id_required_insert
BEFORE INSERT ON projects WHEN NEW.category_id IS NULL
BEGIN SELECT RAISE(ABORT, 'category_id is required'); END;

CREATE TRIGGER IF NOT EXISTS projects_category_id_required_update
BEFORE UPDATE OF category_id ON projects WHEN NEW.category_id IS NULL
BEGIN SELECT RAISE(ABORT, 'category_id is required'); END;

CREATE TABLE IF NOT EXISTS portfolio_metadata (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  data_json TEXT NOT NULL CHECK (json_valid(data_json) AND json_type(data_json) = 'object')
);
