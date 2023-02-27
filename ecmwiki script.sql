-- 사용자 테이블
create table if not exists ecmwiki.ew_user
(
    user_id          varchar(100) primary key comment '사용자 아이디(e-mail)',
    user_pw          varchar(256) not null comment '사용자 비밀번호',
    user_name        varchar(15)  not null comment '사용자 명',
    user_picture     char(16) comment '사용자 프로필 사진(앨리먼트 아이디)',
    phone_number     int comment '전화 번호',
    company          varchar(100) comment '소속',
    regist_date      varchar(14)  not null comment '등록 날짜' default date_format(sysdate(), '%Y%m%d%H%i%s'),
    update_date      varchar(14)  not null comment '수정 날짜' default date_format(sysdate(), '%Y%m%d%H%i%s'),
    last_access_date varchar(14) comment '최근 접속 일자',
    login_try_count  int comment '로그인 시도 횟수'               default 0,
    approval_yn      varchar(1)   not null comment '승인 여부' default 'n' check (approval_yn in ('n', 'y')),
    delete_yn        varchar(1)   not null comment '삭제 여부' default 'n' check (delete_yn in ('n', 'y')),
    authority        varchar(10)  not null comment '권한 코드'
) engine = InnoDB
  default charset utf8 comment '사용자 정보 테이블';

-- 게시글 테이블
create table if not exists ecmwiki.ew_board
(
    board_idx           bigint primary key auto_increment comment '게시글 인덱스 번호',
    board_title         varchar(100) not null comment '게시글 제목',
    board_content       mediumtext   not null comment '게시글 내용',
    board_temporary     varchar(1)   not null comment '게시글 임시저장 여부' default 'n' check (board_temporary in ('n', 'y')),
    user_id             varchar(100) not null comment '게시글 작성자 아이디(e-mail)',
    user_name           varchar(15)  not null comment '게시글 작성자 명',
    menu_id             varchar(24)  not null comment '메뉴 아이디',
    regist_date         varchar(14)  not null comment '등록 날짜'       default date_format(sysdate(), '%Y%m%d%H%i%s'),
    update_date         varchar(14)  not null comment '수정 날짜'       default date_format(sysdate(), '%Y%m%d%H%i%s'),
    board_hits          int          not null comment '조회수'         default 0,
    board_likes         int          not null comment '좋아요'         default 0,
    board_comment_count int          not null comment '댓글 수'        default 0
) engine = InnoDB
  default charset utf8 comment '게시글 테이블';

-- 댓글 테이블
create table if not exists ecmwiki.ew_board_comment
(
    comment_idx     bigint primary key auto_increment comment '댓글 인덱스 번호',
    board_idx       bigint       not null comment '게시글 인덱스 번호',
    target_idx      bigint comment '부모 댓글 인덱스 번호',
    comment_content mediumtext   not null comment '댓글 내용',
    user_id         varchar(100) not null comment '댓글 작성자 아이디(e-mail)',
    user_name       varchar(15)  not null comment '댓글 작성자 명',
    regist_date     varchar(14)  not null comment '등록 날짜' default date_format(sysdate(), '%Y%m%d%H%i%s'),
    update_date     varchar(14)  not null comment '수정 날짜' default date_format(sysdate(), '%Y%m%d%H%i%s')
) engine = InnoDB
  default charset utf8 comment '댓글 테이블';

create table if not exists ecmwiki.ew_board_likes
(
    board_idx bigint       not null comment '게시글 인덱스 번호',
    user_id   varchar(100) not null comment '좋아요 등록 아이디(e-mail)'
) engine = InnoDB
  default charset utf8 comment '좋아요 테이블';

-- 첨부 파일 테이블
create table if not exists ecmwiki.ew_file
(
    target_idx    bigint comment '타겟 인덱스 번호',
    target_type   varchar(24)  not null comment '타겟 타입',
    file_type     varchar(24)  not null comment '게시글 파일 타입',
    elementid     char(16)     not null comment '앨리먼트 아이디',
    org_file_name varchar(250) not null comment '원본 파일 명',
    org_file_ext  varchar(10)  not null comment '원본 파일 확장자',
    org_file_size bigint       not null comment '원본 파일 크기',
    user_id       varchar(100) not null comment '파일 등록자 아이디(e-mail)',
    regist_date   varchar(14)  not null comment '등록 날짜' default date_format(sysdate(), '%Y%m%d%H%i%s')
) engine = InnoDB
  default charset utf8 comment '첨부파일 테이블';

-- 메뉴 테이블
create table if not exists ecmwiki.ew_menu
(
    menu_id     varchar(24) primary key comment '메뉴 아이디',
    menu_name   varchar(100) not null comment '메뉴 명',
    menu_order  int          not null comment '메뉴 순서',
    target_menu varchar(24) comment '부모 메뉴',
    link_url    varchar(100) comment '메뉴 링크 URL',
    regist_date varchar(14)  not null comment '등록 날짜' default date_format(sysdate(), '%Y%m%d%H%i%s')
) engine = InnoDB
  default charset utf8 comment '메뉴 테이블';

-- 태그 테이블
create table if not exists ecmwiki.ew_tag
(
    tag_name         varchar(50) comment '태그 명',
    tag_master_group varchar(24) comment '태그 부모 그룹(depth 1)',
    tag_group        varchar(24) comment '태그 자식 그룹(depth 2)',
    color_code       varchar(6)   not null comment '색상코드'  default '000000',
    user_id          varchar(100) not null comment '태그 작성자 아이디(e-mail)',
    user_name        varchar(15)  not null comment '태그 작성자 명',
    regist_date      varchar(14)  not null comment '등록 날짜' default date_format(sysdate(), '%Y%m%d%H%i%s'),
    primary key (tag_name, tag_master_group, tag_group)
) engine = InnoDB
  default charset utf8 comment '태그 테이블';

-- 태그 타겟 테이블
create table if not exists ecmwiki.ew_tag_target
(
    target_idx       bigint     not null comment '타겟 인덱스 번호',
    tag_name         varchar(50) comment '태그 명',
    tag_master_group varchar(24) comment '태그 부모 그룹(depth 1)',
    tag_group        varchar(24) comment '태그 자식 그룹(depth 2)',
    color_code       varchar(6) not null comment '색상코드' default '000000',
    primary key (target_idx, tag_name, tag_master_group, tag_group)
) engine = InnoDB
  default charset utf8 comment '태그 타겟 테이블';

-- 코드 테이블
create table if not exists ecmwiki.ew_code
(
    code_id     varchar(24) primary key comment '코드 아이디',
    code_name   varchar(100) not null comment '코드 명',
    code_group  varchar(24) comment '코드 그룹',
    description mediumtext comment '코드 설명',
    regist_date varchar(14)  not null comment '등록 날짜' default date_format(sysdate(), '%Y%m%d%H%i%s')
) engine = InnoDB
  default charset utf8 comment '코드 테이블';

-- 사이트 현황 테이블
create table if not exists ecmwiki.ew_site_status
(
    site_idx    bigint primary key auto_increment comment '사이트 인덱스 번호',
    site_title  varchar(100) not null comment '사이트 현황 제목',
    site_data   mediumtext   not null comment '사이트 현황 Json 데이터',
    file_key    varchar(40) comment '첨부 파일 구분 키',
    user_id     varchar(100) not null comment '사이트 등록자 아이디(e-mail)',
    user_name   varchar(15)  not null comment '사이트 등록자 명',
    regist_date varchar(14)  not null comment '등록 날짜' default date_format(sysdate(), '%Y%m%d%H%i%s')
) engine = InnoDB
  default charset utf8 comment '사이트 현황 테이블';

-- +- 권한

-- 사용자 테이블 기본 데이터 삽입
insert into ecmwiki.ew_user (user_id, user_pw, user_name, phone_number, company, authority, approval_yn)
values ("admin@inzent.com", "$2a$10$djwtZBUwnsaCpZz2Qwzw0ubEPpAFXwZ/XY2Dv3d4JRTux6ffHnK0C", "관리자", "01082704222", "(주)인젠트", "ADMIN", "y");

-- 게시글 테이블 기본 데이터 삽입


-- 첨부 파일 테이블 기본 데이터 삽입


-- 댓글 테이블 기본 데이터 삽입


-- 메뉴 테이블 기본 데이터 삽입
-- #부모 메뉴
insert into ecmwiki.ew_menu (menu_id, menu_name, menu_order, target_menu, link_url)
values ("news", "ECM 소식", 1, null, null);

insert into ecmwiki.ew_menu (menu_id, menu_name, menu_order, target_menu, link_url)
values ("workbook", "ECM 통합문서", 2, null, null);

insert into ecmwiki.ew_menu (menu_id, menu_name, menu_order, target_menu, link_url)
values ("community", "커뮤니티", 3, null, null);

insert into ecmwiki.ew_menu (menu_id, menu_name, menu_order, target_menu, link_url)
values ("download", "다운로드", 4, null, null);

insert into ecmwiki.ew_menu (menu_id, menu_name, menu_order, target_menu, link_url)
values ("support", "고객지원", 5, null, null);

-- #자식 메뉴
insert into ecmwiki.ew_menu (menu_id, menu_name, menu_order, target_menu, link_url)
values ("notice", "공지사항", 1, "news", "/board/notice");

insert into ecmwiki.ew_menu (menu_id, menu_name, menu_order, target_menu, link_url)
values ("development", "개발자노트", 2, "news", "/board/development");

insert into ecmwiki.ew_menu (menu_id, menu_name, menu_order, target_menu, link_url)
values ("update", "업데이트 노트", 3, "news", "/board/update");

insert into ecmwiki.ew_menu (menu_id, menu_name, menu_order, target_menu, link_url)
values ("siteStatus", "사이트 현황", 4, "news", "/siteStatus");

insert into ecmwiki.ew_menu (menu_id, menu_name, menu_order, target_menu, link_url)
values ("project", "프로젝트 관련문서", 1, "workbook", "/workbook/project");

insert into ecmwiki.ew_menu (menu_id, menu_name, menu_order, target_menu, link_url)
values ("free", "자유게시판", 1, "community", "/board/free");

insert into ecmwiki.ew_menu (menu_id, menu_name, menu_order, target_menu, link_url)
values ("userList", "워킹 캘린더", 2, "community", "/userList");

insert into ecmwiki.ew_menu (menu_id, menu_name, menu_order, target_menu, link_url)
values ("solution", "솔루션", 1, "download", "/download/solution");

insert into ecmwiki.ew_menu (menu_id, menu_name, menu_order, target_menu, link_url)
values ("document", "매뉴얼", 2, "download", "/download/manual");

insert into ecmwiki.ew_menu (menu_id, menu_name, menu_order, target_menu, link_url)
values ("utility", "유틸리티", 3, "download", "/board/utility");

insert into ecmwiki.ew_menu (menu_id, menu_name, menu_order, target_menu, link_url)
values ("engineer", "담당자", 1, "support", "/support/engineer");

insert into ecmwiki.ew_menu (menu_id, menu_name, menu_order, target_menu, link_url)
values ("faq", "FAQ", 2, "support", "/board/faq");

insert into ecmwiki.ew_menu (menu_id, menu_name, menu_order, target_menu, link_url)
values ("question", "문의사항", 3, "support", "/board/question");

-- 게시글 태그 관리 테이블 기본 데이터 삽입


-- 태그 테이블 기본 데이터 삽입
insert into ecmwiki.ew_tag (tag_name, tag_master_group, tag_group, color_code, user_id, user_name)
values ("필독", "status", "notice", "000000", "admin@inzent.com", "관리자");

insert into ecmwiki.ew_tag (tag_name, tag_master_group, tag_group, color_code, user_id, user_name)
values ("대기", "status", "question", "000000", "admin@inzent.com", "관리자");

insert into ecmwiki.ew_tag (tag_name, tag_master_group, tag_group, color_code, user_id, user_name)
values ("진행", "status", "question", "000000", "admin@inzent.com", "관리자");

insert into ecmwiki.ew_tag (tag_name, tag_master_group, tag_group, color_code, user_id, user_name)
values ("보류", "status", "question", "000000", "admin@inzent.com", "관리자");

insert into ecmwiki.ew_tag (tag_name, tag_master_group, tag_group, color_code, user_id, user_name)
values ("완료", "status", "question", "000000", "admin@inzent.com", "관리자");

insert into ecmwiki.ew_tag (tag_name, tag_master_group, tag_group, color_code, user_id, user_name)
values ("윈백사업", "news", "siteStatus", "000000", "admin@inzent.com", "관리자");

insert into ecmwiki.ew_tag (tag_name, tag_master_group, tag_group, color_code, user_id, user_name)
values ("이미지 마이그레이션 사업", "news", "siteStatus", "00AEFF", "admin@inzent.com", "관리자");

insert into ecmwiki.ew_tag (tag_name, tag_master_group, tag_group, color_code, user_id, user_name)
values ("이미지 분리보관/파기/삭제 사업", "news", "siteStatus", "E6E6FA", "admin@inzent.com", "관리자");

insert into ecmwiki.ew_tag (tag_name, tag_master_group, tag_group, color_code, user_id, user_name)
values ("시스템 고도화 사업", "news", "siteStatus", "9400D3", "admin@inzent.com", "관리자");

insert into ecmwiki.ew_tag (tag_name, tag_master_group, tag_group, color_code, user_id, user_name)
values ("이미지 마스킹 사업", "news", "siteStatus", "8FBC8F", "admin@inzent.com", "관리자");

insert into ecmwiki.ew_tag (tag_name, tag_master_group, tag_group, color_code, user_id, user_name)
values ("이미지 암호화 사업", "news", "siteStatus", "16E046", "admin@inzent.com", "관리자");

insert into ecmwiki.ew_tag (tag_name, tag_master_group, tag_group, color_code, user_id, user_name)
values ("차세대 시스템 구축", "news", "siteStatus", "ED9121", "admin@inzent.com", "관리자");

insert into ecmwiki.ew_tag (tag_name, tag_master_group, tag_group, color_code, user_id, user_name)
values ("이미지 시스템 구축 사업", "news", "siteStatus", "CC338B", "admin@inzent.com", "관리자");

insert into ecmwiki.ew_tag (tag_name, tag_master_group, tag_group, color_code, user_id, user_name)
values ("엔진 업그레이드 사업", "news", "siteStatus", "0000FF", "admin@inzent.com", "관리자");

insert into ecmwiki.ew_tag (tag_name, tag_master_group, tag_group, color_code, user_id, user_name)
values ("DR 서버 구축 사업", "news", "siteStatus", "BAB702", "admin@inzent.com", "관리자");

insert into ecmwiki.ew_tag (tag_name, tag_master_group, tag_group, color_code, user_id, user_name)
values ("엔진 설치", "news", "siteStatus", "6699CC", "admin@inzent.com", "관리자");

insert into ecmwiki.ew_tag (tag_name, tag_master_group, tag_group, color_code, user_id, user_name)
values ("PPR 시스템 구축", "news", "siteStatus", "0E7527", "admin@inzent.com", "관리자");

insert into ecmwiki.ew_tag (tag_name, tag_master_group, tag_group, color_code, user_id, user_name)
values ("XGWA 구성", "news", "siteStatus", "808080", "admin@inzent.com", "관리자");

insert into ecmwiki.ew_tag (tag_name, tag_master_group, tag_group, color_code, user_id, user_name)
values ("ETC 사업", "news", "siteStatus", "3CB371", "admin@inzent.com", "관리자");


-- 코드 테이블 기본 데이터 삽입