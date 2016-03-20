<?php

define('USER_GUST',                     -1);
define('USER_SUPER_ADMIN',              0);
define('USER_ADMIN',                    1);
define('USER_PARTNER',                  2);
define('USER_MEMBER',                   3);

define('USER_STATUS_DEACTIVE',          0);
define('USER_STATUS_ACTIVE',            1);
define('USER_STATUS_BLOCK',             2);
define('USER_STATUS_LOCK',              3);


define('ELEMENT_SELECT',                   1);
define('ELEMENT_INPUT',                    2);
define('ELEMENT_CHECKBOX',                 3);
define('ELEMENT_RADIO',                    4);

define('PAGER_LIMIT',                    20);

// PAGES
define('PAGE_HOME',                 1);
define('PAGE_ERROR',                2);
define('PAGE_SEARCH',               3);
define('PAGE_PRODUCT',              4);
define('PAGE_ABOUT',                5);
define('PAGE_BLOG',                 6);
define('PAGE_SERVICE',              7);
define('PAGE_CONTACT',              8);
define('PAGE_FAQ',                  9);
define('PAGE_PORTFOLIO',            10);

// Table
define('TABLE_PAGE',                DB_PREFIX . 'pages');
define('TABLE_CATEGORY',            DB_PREFIX . 'category');
define('TABLE_NEWS',                DB_PREFIX . 'news');
define('TABLE_LANGUAGE',            DB_PREFIX . 'language');
define('TABLE_SETTING',             DB_PREFIX . 'setting');
define('TABLE_USER',                DB_PREFIX . 'users');
define('TABLE_MEMBER',              DB_PREFIX . 'user');
define('TABLE_TOUR_GUIDE',          DB_PREFIX . 'tour_guide');