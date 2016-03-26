/**
 * Ng controller for Hotel Setting Listing Page
 */
"use strict";

app.controller('MemberController',
    function($scope, $rootScope, $route, apiService, $timeout, $location, $compile, $sce) {
        console.log('member controller');

        $scope.fetched = false;
        $scope.saving = false;
        $scope.searching = false;
        $scope.reset = false;
        $scope.start_edit = false;

        var link = {
            list: '/misc/member',
            edit: '/misc/member@edit',
            save: '/misc/member@save',
            delete: '/misc/member@delete'
        };


        var optionDateEx = {};
        var filterParams = {};

        // init Tinymce
        $scope.tiny_options = $tinymceOptions.tiny;
        
        $scope.init = function (data) {
            $scope.link     = link;
            if ( typeof data != isInvalid ) {
                $scope.test     = data.test || {};
                $scope.list     = data.list || {};
                $scope.header   = data.header || {};
                $scope.filter   = data.filter || {};
                $scope.paging   = data.paging || {};
                $scope.gender   = data.gender || {};
            }
        };

        $scope.sleep = function ($time) {
            $timeout(function(){
                $scope.loaded = true;
            }, $time);
        };

        $scope.fetchPage = function (pageNum) {
            if (  $scope.paging == isDefined ) {
                if (pageNum == 'n') pageNum = $scope.paging.PageNext;
                else if (pageNum == 'p') pageNum = $scope.paging.PagePrev;

                if ( (pageNum > 0 && pageNum <= $scope.paging.TotalPage) || ($scope.paging.TotalPage == 0) ) {
                    jQuery.extend(filterParams, {pageNum: pageNum});
                    $scope.fetched = false;
                }
            }

            var params = {};
            if ( $scope.searching ) {
                if ( typeof $scope.filter.columns != isInvalid ) {
                    var filter = $scope.filter.columns;
                    for (var key in filter) {
                        var elm = '#filter' + key;
                        var value = jQuery(elm).val();
                        if ( value != isUndefined && value != isEmpty) {
                            if ( jQuery(elm).parent().hasClass("input-calendar") ) {
                                value = $scope.revertToString(value);
                            }
                            params[key] = value;
                        }
                    }
                }
            }

            if ( !$scope.fetched ) {
                return apiService.list($scope.link.list, params).then(function (response) {
                    $scope.init(response.data);
                    $scope.fetched = true;
                    $scope.searching = false;
                    $timeout(function(){
                        $scope.loaded = true;
                    }, 1000);
                });
            }
        };

        $scope.edit = function(id){
            $scope.start_edit = true;
            $scope.submitted = false;
            // jQuery('#modalEdit').foundation('reveal', 'open');
            //$compile(jQuery('#modalEdit').html())($scope);

            apiService.get($scope.link.edit, id).then(function (response) {
                var data = response.data;
                $scope.member = {};
                if ( typeof data != isInvalid ) {

                    $scope.typeList = data.typeList;
                    $scope.statusList = data.statusList;

                    var member = data.member;
                    $scope.member.ID = id;
                    $scope.member.Type = __render(member.type);
                    $scope.member.Active = __render(member.enable);
                    $scope.member.FirstName = member.first_name;
                    $scope.member.LastName = member.last_name;
                    $scope.member.Email = member.email;
                    $scope.member.UserName = member.login_name;

                    tinyMCE.execCommand("mceAddControl", false, 'correspondence_content');
                }
            });
        };
        
        $scope.save = function(form){
           if ( $scope.saving ) {
               return;
           }
           $scope.submitted = true;

           // if(tls.checkPhoneSMS('phone') == 1){
           //     $scope.phoneInvalid = true;
           //     var $elm = jQuery('#phone');
           //     $elm.focus();
           //     tls.scrollElementToCenter($elm);
           //     return;
           // }else{
           //     $scope.phoneInvalid = false;
           // }

           if( !form.$invalid ){
               $scope.dataHasSaved();
               $scope.saving = true;
               apiService.save($scope.link.save, form).then(function (response) {
                   $timeout(function () {
                       $scope.saving = false;
                       jQuery('#modelEdit').modal('toggle');
                       //jQuery('#modalEdit').foundation('reveal', 'close');
                       $scope.init(response.data);
                   }, 1000);
               });
           }else{
               var $elm = jQuery('#modalEdit input.ng-invalid:first');
               $elm.focus();
               app.scrollElementToCenter($elm);
           }
        };

        $scope.delete = function (id, name) {
            name = name ? name : '';
            $scope.IDDelete = id;

            var messageDelete = jQuery('#messageDelete').text();
            jQuery('#modalDelContent').html(messageDelete + ' ' + name + '?');
            //jQuery('#modalDel').foundation('reveal', 'open');
        };
        $scope.submitDel = function (id) {
            apiService.delete($scope.link.delete, id).then(function (response) {
                $timeout(function () {
                    jQuery('#modelDelete').modal('toggle');
                    $scope.init(response.data);
                }, 1000);
            });
        };

        $scope.find = function () {
            $scope.fetched = false;
            $scope.searching = true;
            $scope.fetchPage();
        };

        // Sort on header
        $scope.sort = function (field, enable) {
            if(enable=="true" || enable=="1" || enable==1 || enable==true){
                if ($scope.sorter.sortBy == field)
                    $scope.sorter.sortDir = $scope.sorter.sortDir == 'asc' ? 'desc' : 'asc';
                else {
                    $scope.sorter.sortBy = field;
                    $scope.sorter.sortDir = 'asc';
                }
                jQuery.extend(filterParams, {sortDir: $scope.sorter.sortDir, sortBy: $scope.sorter.sortBy});
                $scope.fetchPage($scope.paging.PageNum);
            }
        };

        $scope.sortList = function(list) {
            list.sort(function(a, b) {
                return (a.sort - b.sort);
            });
        };

        $scope.getLang = function(content, show) {
            try {
                var obj = JSON.parse(content);
                if (typeof obj == 'object')
                {
                    if (show == true)
                        return obj['en'];
                    else
                    if (typeof obj[$scope.languageCur] !== 'undefined')
                        return obj[$scope.languageCur];
                    else
                        return '';
                }
            } catch (e) {
                if (show == true)
                    return content;
                else
                    return '';
            }
        };

        //run
        if( $scope.tiny_options !== isInvalid ) tinyMCE.init($scope.tiny_options);
        $scope.init();
        $scope.fetchPage();

        jQuery('#modalDel, #modalEdit').data('reveal-init', {
            animation: 'fadeAndPop',
            animation_speed: 250,
            close_on_background_click: true,
            close_on_esc: true,
            dismiss_modal_class: 'close-reveal-modal',
            bg_class: 'reveal-modal-bg',
            bg: jQuery('.reveal-modal-bg'),
            css: {
                open: {
                    'opacity': 0,
                    'visibility': 'visible',
                    'display': 'block'
                },
                close: {
                    'opacity': 1,
                    'visibility': 'hidden',
                    'display': 'none'
                }
            }
        });

        $scope.ngDirtyInvalid = function(form, elementName) {
                return ($scope[form][elementName].$dirty
            && $scope[form][elementName].$invalid && $scope.submitted);
        };
        $scope.ngInvalid = function(form, elementName) {
                return ($scope[form][elementName].$invalid && $scope.submitted);
        };
        $scope.ngInvalidEmail = function(form, elementName) {
                return ($scope[form][elementName].$error.multipleEmails && $scope.submitted);
        };
        $scope.ngDirtyErrorRequired = function(form, elementName) {
            return ($scope[form][elementName].$dirty
            && $scope[form].$error.required && $scope.submitted);
        };
        $scope.ngErrorRequired = function(form, elementName) {return false;
            //return ($scope[form][elementName].$error.required && $scope.submitted);
        };

        jQuery('#modalEdit').on('hidden.bs.modal', function() { $timeout(function() { $scope.start_edit = false; }, 500); });
        jQuery('#modalEdit').on('show.bs.modal', function() { $scope.start_edit = true; });

        //Begin Calendar]
        $scope.showCalendar = function () {
            var dateToday = new Date();
            var yrRange = dateToday.getFullYear()-50 + ":" + (dateToday.getFullYear());
            var optionDate = {dateFormat: 'dd M yy', numberOfMonths: 1, stepMonths: 1, maxDate: 0 ,changeMonth: true,
                changeYear: true, yearRange: yrRange};
            jQuery("#guideDOB").datepicker(optionDate);
        };
        $scope.revertToString = function (date) {
            return Date.parse(date) / 1000;
        };
        $scope.convertToDate = function (stringDate) {
            var myObj = stringDate,
                myDate = new Date(1000 * myObj);
            return (myDate.toDateString());
        };
        $scope.convertDate = function (string) {
            var mnths = {
                1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
                7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
            };
            var date = new Date(string);
            var date_value = [date.getDate(), mnths[date.getMonth() + 1], date.getFullYear()].join(" ");
            return date_value;
        };
        // translate calender
        $scope.translateCalendar = function (element, calender) {
            var temp = element;
            temp = temp.replace('Jan', calender[0]);
            temp = temp.replace('Feb', calender[1]);
            temp = temp.replace('Mar', calender[2]);
            temp = temp.replace('Apr', calender[3]);
            temp = temp.replace('May', calender[4]);
            temp = temp.replace('Jun', calender[5]);
            temp = temp.replace('Jul', calender[6]);
            temp = temp.replace('Aug', calender[7]);
            temp = temp.replace('Sep', calender[8]);
            temp = temp.replace('Oct', calender[9]);
            temp = temp.replace('Nov', calender[10]);
            temp = temp.replace('Dec', calender[11]);
            element = temp;
            return element;
        };
        //End Calendar
});