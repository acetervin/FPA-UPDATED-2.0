ALTER TABLE gallery_images RENAME TO gallery_images_old;

CREATE TABLE gallery_images (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

INSERT INTO gallery_images (url, created_at)
SELECT url, created_at FROM gallery_images_old;

DROP TABLE gallery_images_old;
