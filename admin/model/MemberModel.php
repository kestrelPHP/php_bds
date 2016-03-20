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
    public function get_member_list() {
        $query = $this->db->query("SELECT * FROM " . TABLE_MEMBER . " WHERE `enable`=1" );

        return $query;
    }

    public function get($id){
        $member = new Member();
        $query = $this->db->query("SELECT * FROM " . TABLE_MEMBER . " WHERE id='".$id."' AND enable=1");

        if ( $query->num_rows > 0 ){
            $member = $query->row;
        }

        return $member;
    }

    public function delete($id){
        $result = $this->db->query("DELETE  FROM " . TABLE_MEMBER . " WHERE id='".$id."'");

        return $result;
    }
}