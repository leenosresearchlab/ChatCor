-- Database 생성
create database db_chatcor;

-- Database 확인
show databases;

-- ChatCor 계정 생성
create user 'chatcor_admin'@'localhost' identified by 'chatcor';

-- User 확인
select host, user from mysql.user;

-- DB 사용자 권한 부여
grant all privileges on db_chatcor.* to 'chatcor_admin'@'localhost';
flush privileges;

-- DB 연결
use db_chatcor;

-- Table 목록 확인
show tables;

-- 사용자 Table 생성 (db_chatcor)
CREATE TABLE `users` (
  `USER_NAME` varchar(300) NOT NULL COMMENT '사용자이름',
  `USER_EMAIL` varchar(300) NOT NULL COMMENT '사용자email',
  `USER_PASSWORD` varchar(300) NOT NULL COMMENT '비밀번호',
  `USER_ROLE` varchar(20) NOT NULL DEFAULT 'ROLE_USER' COMMENT '사용자권한',
  PRIMARY KEY (`USER_EMAIL`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='ChatCor_사용자';