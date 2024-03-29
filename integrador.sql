-- Active: 1688047475634@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL
    );

CREATE TABLE
    posts (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT(0) NOT NULL,
        dislikes INTEGER DEFAULT(0) NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL,
        updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE
    );

CREATE TABLE
    likes_dislikes (
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        like INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts (id) ON UPDATE CASCADE ON DELETE CASCADE
    );

CREATE TABLE
    comments (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT(0) NOT NULL,
        dislikes INTEGER DEFAULT(0) NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts (id) ON UPDATE CASCADE ON DELETE CASCADE
    );

CREATE TABLE
    likes_dislikes_comments (
        user_id TEXT NOT NULL,
        comment_id TEXT NOT NULL,
        like INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (comment_id) REFERENCES comments (id) ON UPDATE CASCADE ON DELETE CASCADE
    );


INSERT INTO
    users (id, name, email, password, role)
VALUES
    -- tipo NORMAL e senha = fulano123 
    (
        'u001',
        'Fulano',
        'fulano@email.com',
        '$2a$12$qPQj5Lm1dQK2auALLTC0dOWedtr/Th.aSFf3.pdK5jCmYelFrYadC',
        'NORMAL'
    ),
    -- tipo NORMAL e senha = beltrana00 
    (
        'u002',
        'Beltrana',
        'beltrana@email.com',
        '$2a$12$403HVkfVSUbDioyciv9IC.oBlgMqudbnQL8ubebJIXScNs8E3jYe2',
        'NORMAL'
    ),
    -- tipo ADMIN e senha = astrodev99 
    (
        'u003',
        'Astrodev',
        'astrodev@email.com',
        '$2a$12$lHyD.hKs3JDGu2nIbBrxYujrnfIX5RW5oq/B41HCKf7TSaq9RgqJ.',
        'ADMIN'
    );

INSERT INTO
    posts (id, creator_id, content)
VALUES (
        'p001',
        'u001',
        'Hoje acordei feliz'
    ), (
        'p002',
        'u002',
        'Amanhã tenho prova de inglês! Estou estudando muito!'
    );

INSERT INTO
    likes_dislikes (user_id, post_id, like)
VALUES ('u002', 'p001', '1'), ('u003', 'p001', '1'), ('u001', 'p002', '1'), ('u003', 'p002', '0');

INSERT INTO
    comments (id, creator_id, post_id, content)
VALUES ('c001', 'u001', 'p001', 'que lindo'), 
        ('c002', 'u001', 'p001', 'parabéns'), 
        ('c003', 'u002', 'p001','gostei muito');

INSERT INTO likes_dislikes_comments (user_id, comment_id, like)
VALUES 
    ('u001', 'c001', '1'),
    ('u001', 'c002', '0'),
    ('u002', 'c002', '1');



SELECT * FROM users;

SELECT * FROM posts;

SELECT * FROM likes_dislikes;

SELECT * FROM comments;

SELECT * FROM likes_dislikes_comments;




UPDATE posts SET likes = 2, dislikes = 0 WHERE id = 'p001';

UPDATE posts SET likes = 1, dislikes = 1 WHERE id = 'p002';

UPDATE comments SET likes = 1, dislikes = 0 WHERE id = 'c001';
UPDATE comments SET likes = 1, dislikes = 1 WHERE id = 'c002';



-- tables need be deleted in that order

DROP TABLE likes_dislikes;

DROP TABLE posts;

DROP TABLE users;

DROP TABLE likes_dislikes_comments;

DROP TABLE comments;

