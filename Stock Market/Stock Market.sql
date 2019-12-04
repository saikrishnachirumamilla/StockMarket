DROP DATABASE if exists Stockmarket;
CREATE DATABASE Stockmarket;
USE Stockmarket;

CREATE TABLE userdata(
   userid INT(20) NOT NULL AUTO_INCREMENT,
   username VARCHAR(20),
   firstname VARCHAR(20),
   lastname VARCHAR(20),
   password Char(40),
   type VARCHAR(20),                                         
   PRIMARY KEY(userid)
);

CREATE TABLE stocklist(
	stockid INT(20) NOT NULL AUTO_INCREMENT,
	stockname VARCHAR(40),
	stock_symbol VARCHAR(20),
	open DECIMAL(10,2),
	volume BIGINT,
	high DECIMAL(10,2),
	low DECIMAL(10,2),
	deleted BOOLEAN NOT NULL DEFAULT FALSE,
	category VARCHAR(20),
	PRIMARY KEY(stockid)
);

CREATE TABLE transactions(
	transactionid INT(20) NOT NULL AUTO_INCREMENT,
	userid INT(20),
	date DATE,
	amount DECIMAL(10,2),
	type ENUM('credit','debit'),
	balance DECIMAL(10,2),
	PRIMARY KEY(transactionid),
	FOREIGN KEY(userid) REFERENCES userdata(userid)
);

CREATE TABLE cart(
	cartid INT(20) NOT NULL AUTO_INCREMENT,
	userid INT(20),
	stockid INT(20),
	quantity BIGINT(255),
	PRIMARY KEY(cartid),
	FOREIGN KEY(userid) REFERENCES userdata(userid),
	FOREIGN KEY(stockid) REFERENCES stocklist(stockid)
);

CREATE TABLE watchlist(
	watchid INT(20) NOT NULL AUTO_INCREMENT,
	userid INT(20),
	stockid INT(20),
	PRIMARY KEY(watchid),
	FOREIGN KEY(userid) REFERENCES userdata(userid),
	FOREIGN KEY(stockid) REFERENCES stocklist(stockid)
);

CREATE TABLE analytics(
	analyticid int(20) NOT NULL AUTO_INCREMENT,
	userid int(20),
	transactionid int(20),
	stockid int(20),
	quantity int(20),
	price DECIMAL(10,2),
	PRIMARY KEY(analyticid),
	FOREIGN KEY(userid) REFERENCES userdata(userid),
	FOREIGN KEY(transactionid) REFERENCES transactions(transactionid),
	FOREIGN KEY(stockid) REFERENCES stocklist(stockid)
);

CREATE TABLE mystock(
	mystockid int(20) NOT NULL AUTO_INCREMENT,
	userid int(20),
	stockid int(20),
	quantity int(20),
	PRIMARY KEY(mystockid),
	FOREIGN KEY(userid) REFERENCES userdata(userid),
	FOREIGN KEY(stockid) REFERENCES stocklist(stockid)
);

INSERT INTO userdata (username,password,firstname,lastname,type) VALUES ('admin@gmail.com', SHA1('password'),'Admin','', 'admin');
-- INSERT INTO userdata (username,password,firstname,lastname,type) VALUES ('naveen@gmail.com', SHA1('qwerty'), 'naveen', 'inaganti','user');
-- INSERT INTO userdata (username,password,firstname,lastname,type) VALUES ('saikrishna@gmail.com', SHA1('zxcvbnm'), 'sai', 'krishna', 'user');
-- INSERT INTO userdata (username,password,firstname,lastname,type) VALUES ('mohan@gmail.com', SHA1('abcdfg'), 'krishna', 'mohan', 'user');
-- select * from userdata;

INSERT INTO stocklist (stockname,stock_symbol,category,volume,open,high,low) VALUES ('amazon', 'amzn', 'technology', '3931141', '1760.05', '1761.68', '1732.86');
INSERT INTO stocklist (stockname,stock_symbol,category,volume,open,high,low) VALUES ('apple', 'aapl','technology','25093666', '263.68', '265.77', '263.01');
INSERT INTO stocklist (stockname,stock_symbol,category,volume,open,high,low) VALUES ('microsoft', 'msft', 'technology', '23508807', '148.93', '149.99', '148.27');
INSERT INTO stocklist (stockname,stock_symbol,category,volume,open,high,low) VALUES ('google', 'googl', 'technology', '1397268', '1315.05', '1333.54', '1311.89');
INSERT INTO stocklist (stockname,stock_symbol,category,volume,open,high,low) VALUES ('facebook', 'fb', 'technology', '11530232', '194.26', '195.30', '193.38');
INSERT INTO stocklist (stockname,stock_symbol,category,volume,open,high,low) VALUES ('tesla', 'tsla', 'automobile', '4659576', '350.64', '352.80', '348.36');
INSERT INTO stocklist (stockname,stock_symbol,category,volume,open,high,low) VALUES ('honda', 'hmc', 'automobile', '432019', '28.95', '29.06','28.91');
INSERT INTO stocklist (stockname,stock_symbol,category,volume,open,high,low) VALUES ('toyota', 'tm', 'automobile', '114164', '144.01', '144.40', '143.92');
INSERT INTO stocklist (stockname,stock_symbol,category,volume,open,high,low) VALUES ('ferrari', 'race', 'automobile', '109150', '166.91', '167.50', '166.61');
INSERT INTO stocklist (stockname,stock_symbol,category,volume,open,high,low) VALUES ('general motors company', 'gm', 'automobile', '12171651', '37.0', '37.11', '36.72');
INSERT INTO stocklist (stockname,stock_symbol,category,volume,open,high,low) VALUES ('eli lilly and co', 'lly', 'pharmaceutical', '4857381', '111.33', '113.82', '111.33');
INSERT INTO stocklist (stockname,stock_symbol,category,volume,open,high,low) VALUES ('Merck and co', 'mrk', 'pharmaceutical', '9233008', '84.69','85.60', '84.64');
INSERT INTO stocklist (stockname,stock_symbol,category,volume,open,high,low) VALUES ('pfizer inc', 'pfe', 'pharmaceutical', '34515591', '36.63', '37.47', '36.52');
INSERT INTO stocklist (stockname,stock_symbol,category,volume,open,high,low) VALUES ('zoetis inc', 'zts', 'pharmaceutical', '3429385', '116.72', '117.92', '116.21');
INSERT INTO stocklist (stockname,stock_symbol,category,volume,open,high,low) VALUES ('johnson and johnson', 'jnj', 'pharmaceutical', '10495624', '131.25', '134.97', '130.78');
INSERT INTO stocklist (stockname,stock_symbol,category,volume,open,high,low) VALUES ('jpmorgan chase and co', 'jpm', 'banking', '10163667', '129.23', '129.53', '128.40');
INSERT INTO stocklist (stockname,stock_symbol,category,volume,open,high,low) VALUES ('bank of america corp', 'bac', 'banking', '36405442', '32.92', '32.96', '32.70');
INSERT INTO stocklist (stockname,stock_symbol,category,volume,open,high,low) VALUES ('citigroup inc', 'c', 'banking', '10295021', '74.34', '74.46', '73.68');
INSERT INTO stocklist (stockname,stock_symbol,category,volume,open,high,low) VALUES ('wells fargo and co', 'wfc','banking','25763','53.78','53.94','53.43');
INSERT INTO stocklist (stockname,stock_symbol,category,volume,open,high,low) VALUES ('goldman sachs group inc', 'gs', 'banking', '1693160', '220', '221.09', '219.04');
-- SELECT * from stocklist;

-- INSERT INTO transactions (userid,amount,date,balance,type) VALUES ('2', '200000', '2019-11-15', '200000', 'credit');
-- INSERT INTO transactions (userid,amount,date,balance,type) VALUES ('2', '158301', '2019-11-15', '41699', 'debit');
-- INSERT INTO transactions (userid,amount,date,balance,type) VALUES ('2', '18256', '2019-11-15', '23443', 'debit');
-- INSERT INTO transactions (userid,amount,date,balance,type) VALUES ('2', '40000', '2019-11-15', '63433', 'credit');
-- INSERT INTO transactions (userid,amount,date,balance,type) VALUES ('2', '6936', '2019-11-15', '56497','debit');
-- INSERT INTO transactions (userid,amount,date,balance,type) VALUES ('2', '21020', '2019-11-15', '35477','debit');
-- INSERT INTO transactions (userid,amount,date,balance,type) VALUES ('2', '22270', '2019-11-15', '13207','debit');
-- SELECT * from transactions;


-- INSERT INTO analytics (userid,transactionid,stockid,quantity,price) VALUES ('2', '2', '1', '90', '1758.9');
-- INSERT INTO analytics (userid,transactionid,stockid,quantity,price) VALUES ('2', '3', '2', '70', '260.8');
-- INSERT INTO analytics (userid,transactionid,stockid,quantity,price) VALUES ('2', '5', '3', '60', '115.6');
-- INSERT INTO analytics (userid,transactionid,stockid,quantity,price) VALUES ('2', '6', '5', '100', '210.2');
-- INSERT INTO analytics (userid,transactionid,stockid,quantity,price) VALUES ('2', '7', '4', '17', '22270');
-- SELECT * from analytics;

-- INSERT INTO mystock (userid,stockid,quantity) VALUES ('2', '1', '90');
-- INSERT INTO mystock (userid,stockid,quantity) VALUES ('2', '2', '70');
-- INSERT INTO mystock (userid,stockid,quantity) VALUES ('2', '3', '60');
-- INSERT INTO mystock (userid,stockid,quantity) VALUES ('2', '5', '100');
-- INSERT INTO mystock (userid,stockid,quantity) VALUES ('2', '4', '17');
-- SELECT * from mystock;