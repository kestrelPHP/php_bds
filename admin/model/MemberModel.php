<?php
class Member {
    public $first_name="";
    public $last_name="";
    public $type="-1";
    public $enable='1';
    public $login_name="";
    public $password="";
}

class MemberModel extends Model {
    public function get_list($params=array()) {
        $condition = " 1=1 AND `enable`=1 ";
        foreach ((array)$params as $key => $value) {
            $condition .= " AND " . $key . " = " . "'$value'";
        }
        $query = $this->db->query("SELECT * FROM " . TABLE_MEMBER . " WHERE " . $condition);

        return $query;
    }

    public function get($id){
        $condition = " `enable`=1 AND id=".$id;
        $member = new Member();
        $query = $this->db->query("SELECT * FROM " . TABLE_MEMBER . " WHERE " . $condition);

        if ( $query->num_rows > 0 ){
            $member = $query->row;
        }

        return $member;
    }

    public function delete($id){
        $condition = " id=".$id;
        $result = $this->db->query("DELETE  FROM " . TABLE_MEMBER . " WHERE " . $condition);

        return $result;
    }
}