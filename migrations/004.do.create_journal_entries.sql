CREATE TABLE journal_entries (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  user_dest_id INTEGER REFERENCES user_dest(userdest_id) ON DELETE CASCADE,
  dest_id INTEGER REFERENCES destinations(dest_id) ON DELETE CASCADE,
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);