<?php
class LanguageModel extends Model {
    public function fetchAll() {
        $query = $this->db->query("SELECT * FROM " . DB_PREFIX . TABLE_LANGUAGE . " WHERE status = '1'");

        return $query->rows;
    }

    public function getCurrentLanguage($route) {
        $query ="SELECT l.code, p.parent_id as pid FROM " . DB_PREFIX . TABLE_LANGUAGE . " l inner join " . DB_PREFIX . TABLE_PAGE . " p on p.language_id=l.language_id  WHERE p.code='". $route ."' AND l.status = '1'" ;

        $result = $this->db->query($query);
        if($result->num_rows > 0){
            $detect = new stdClass();
            $detect->code = $result->row['code'];
            $detect->page_id = $result->row['pid'];
            return $detect;
        }

        return 0;
    }
}