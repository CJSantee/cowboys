-- Sign-in credentials for the cowboy view: each cowboy's existing Pool Scores
-- username and bcrypt password hash, exported with the rest of the archive.
CREATE TABLE cowboy_logins (
  cowboy_id INTEGER PRIMARY KEY REFERENCES cowboys (cowboy_id),
  username TEXT NOT NULL UNIQUE COLLATE NOCASE, -- matched case-insensitively, like Pool Scores
  password_hash TEXT NOT NULL -- bcrypt
);
