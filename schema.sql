SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS users, portfolio, watchlist;

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    username varchar(30) NOT NULL,
    password varchar(20) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX user_id (id ASC)
);

CREATE TABLE portfolio (
    user_id INT NOT NULL,
    stock varchar(10) NOT NULL,
    PRIMARY KEY (user_id, stock),
    UNIQUE INDEX portfolio_id (user_id, stock),
    CONSTRAINT fk_portfolio_id
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION
);

CREATE TABLE watchlist (
   user_id INT NOT NULL,
   stock varchar(10) NOT NULL,
   PRIMARY KEY (user_id, stock),
   UNIQUE INDEX watchlist_id (user_id, stock),
   CONSTRAINT fk_watch_id
       FOREIGN KEY (user_id)
       REFERENCES users (id)
       ON DELETE CASCADE
       ON UPDATE NO ACTION
);

INSERT INTO users (username, password)
VALUES ('hobs', '1234');

INSERT INTO portfolio (user_id, stock)
VALUES ((select id from users where username='hobs'), 'AMD'),
       ((select id from users where username='hobs'), 'TSLA'),
       ((select id from users where username='hobs'), 'GOOG');

INSERT INTO watchlist (user_id, stock)
VALUES ((select id from users where username='hobs'), 'BBBY'),
       ((select id from users where username='hobs'), 'AAPL'),
       ((select id from users where username='hobs'), 'NVDA');

SET FOREIGN_KEY_CHECKS=1