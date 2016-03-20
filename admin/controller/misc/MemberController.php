<?php

/**
 * Created by PhpStorm.
 * User: Nam Dinh
 * Date: 3/13/2016
 * Time: 5:32 PM
 */
class MemberController extends Controller
{

    public function index(){
        try{
            $request = $this->request->request;
            $session = $this->session->data;
            $data = $paging = $sidebar = $filter = $test = $list = $params = array();
            $listGender = array();

            // init display
            $fields = array(
                'first_name'        => array('data' => 'First Name', 'icon' => 'true', 'element' => '', 'width' => '15%'),
                'last_name'         => array('data' => 'Last Name', 'icon' => 'true', 'element' => '','width' => '15%'),
                'email'             => array('data' => 'Email', 'icon' => 'true', 'element' => '','width' => '20%'),
                'type'              => array('data' => 'Mod', 'icon' => 'true', 'element' => '', 'width' => '8%'),
                'enable'            => array('data' => 'Active', 'icon' => 'false', 'element' => 'checkbox','width' => '8%'),
            );
            $filter = array(
                'Name'    => array('data' => "Nam", 'content' => '', 'field' => 'last_name',
                    'label'=>'First Name','element' => 'text','class'=>'perc20'),
//                'Email'    => array('data' => "-1", 'content' => '', 'field' => 'email',
//                    'label'=>'First Name','element' => 'select','class'=>'perc20'),
            );

            foreach ($request as $key => $value) {
                if ( isset($filter[$key]) ) {
                    $params[$filter[$key]['field']] = $value;
                }

            }

            // init values
            $modelMember = $this->load->model('Member');
            $items = $modelMember->get_list($params);
            $totalItems = $items->num_rows;
            $list = $items->rows;

            $listType = array(
                USER_GUST               =>  "-- Select --",
                USER_SUPER_ADMIN        =>  "Super Admin",
                USER_ADMIN              =>  "Admin",
                USER_PARTNER            =>  "Partner",
                USER_MEMBER             =>  "Member",
            );


//            $header['fields']['first_name']['iconSort'] = 'asc';

            // analysis data
            $paging['PageNum'] = isset($request['pageNum']) ? (int)$request['pageNum'] : 1;
            foreach ($filter as $key => &$value) {
                $value['data'] = isset($request[$key])?$request[$key]:(isset($session[$key])?$session[$key]:$value['data']);
                switch ( $value['element'] ){
                    case 'select':
                        $value['content']   = __render($listType);
                        $value['data']      = __render($value['data'], $listType[$value['data']]);
                        break;
                }
            }
            foreach ($list as &$item) {
                $item['type'] = $listType[$item['type']];
            }


            // merge data
            $header = array( 'columns' => $fields, 'rows' => array_keys($fields) );
            $filter = array( 'columns' => $filter, 'rows' => array_keys($filter) );
            $paging['TotalItem'] = isset($totalItems) ? (int)$totalItems : 0;
            $paging['TotalPage'] = ceil($paging['TotalItem']/ PAGER_LIMIT);
            $paging['PageNext'] = $paging['PageNum'] + 1;
            $paging['PagePrev'] = $paging['PageNum'] - 1;

            // rebuild session
//            $_SESSION['page_guide_'.$operatorId]['paging'] = $paging;

            $data['test']               = $test;
            $data['header']             = $header;
            $data['filter']             = $filter;
            $data['list']               = $list;
            $data['gender']             = $listType;
            $data['paging']             = $paging;

            return $data;

        } catch (Exception $ex){
            throw $ex;
        }
    }

    public function edit() {
        $request = $this->request->request;
        $loader = $this->load;

        $pid = $request['pid'];
        $modelUser = $loader->model('Member');
        $items = $modelUser->get($pid);

        $listType = array(
            USER_GUST               =>  "-- Select --",
            USER_SUPER_ADMIN        =>  "Super Admin",
            USER_ADMIN              =>  "Admin",
            USER_PARTNER            =>  "Partner",
            USER_MEMBER             =>  "Member",
        );

        $statusList = array(
            USER_STATUS_DEACTIVE    => "Inactive",
            USER_STATUS_ACTIVE      => "Active",
        );

        $data['member']         = $items;
        $data['typeList']       = __render($listType);
        $data['statusList']     = __render($statusList);
        return $data;
    }

    public function delete() {
        $request = $this->request->request;
        $loader = $this->load;

        $pid = $request['pid'];
        $modelUser = $loader->model('Member');
        $result = $modelUser->delete($pid);

        if ( $result ) {
            return $this->index();
        }
    }
}