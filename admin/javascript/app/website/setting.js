/**
 * Ng controller for Hotel Setting Listing Page
 */
"use strict";

app.controller('SettingController',
    function($scope, $rootScope, $route, apiService, $timeout, $location, $compile, $sce) {
        console.log('setting controller');

        $scope.fetched = false;
        $scope.saving = false;
        $scope.searching = false;
        $scope.reset = false;

        var optionDateEx = {};
        var calendar = ['#guideDOB'];
        var filter = {param_1:'filterName'};

        // init Tinymce
        $scope.tiny_options = $tinymceOptions.tiny;
        $scope.fileupload_options = $uploadOptions.default;
        $scope.fileUploadChange = function () {

        };

        $scope.init = function (data) {
            if ( typeof data != isInvalid ) {
                $scope.sidebar = data.sidebar || {};
                $scope.list = data.list || {};
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
                for (var key in filter) {
                    var value = jQuery('#' + filter[key] ).val();
                    if ( value != isUndefined ) {
                        if ( jQuery(filter[key]).parent().hasClass("input-calendar") ) {
                            value = $scope.revertToString(value);
                        }
                        params[key] = value;
                    }
                }
            }

            if ( !$scope.fetched ) {
                return apiService.list("/website/setting", params).then(function (response) {
                    $scope.init(response.data);
                    $scope.fetched = true;
                    $timeout(function(){
                        $scope.loaded = true;
                    }, 1000);
                });
            }
        };

        $scope.edit = function(id){
            $scope.submitted = false;
            jQuery('#modalEdit').foundation('reveal', 'open');
            //$compile(jQuery('#modalEdit').html())($scope);
            $scope.guide = {};
            $scope.guide.ID = id;

            apiService.get(id).then(function (response) {
                var guide = response.data.guide;
                $scope.guide.Status = {key: guide.GuideStatus};
                $scope.guide.Gender = {key: guide.Sex};
                $scope.guide.FirstName = guide.FirstName;
                $scope.guide.LastName = guide.LastName;
                $scope.guide.Email = guide.Email;
                $scope.guide.Phone = guide.Phone;
                $scope.guide.DOB = guide.DOB;
                jQuery("#guideDOB").datepicker(optionDateEx).datepicker("setDate", guide.DOB);

                $timeout(function(){
                    jQuery('#phone').intlTelInput({
                        defaultCountry: response.data.country_code
                    });
                }, 1000);
            });
        };

        $scope.save = function(form){
            if ( $scope.saving ) {
                return;
            }
            $scope.submitted = true;

            if( !form.$invalid ){
                $scope.dataHasSaved();
                $scope.saving = true;
                apiService.save( form ).then(function (response) {
                    $timeout(function () {
                        $scope.saving = false;
                        jQuery('#modalEdit').foundation('reveal', 'close');
                        $scope.init(response.data);
                    }, 1000);
                });
            }else{
                var $elm = jQuery('#modalEdit input.ng-invalid:first');
                $elm.focus();
                tls.scrollElementToCenter($elm);
            }
        };

        $scope.deleteItem = function (id, name) {
            name = name ? name : '';
            $scope.IDDelete = id;

            var messageDelete = jQuery('#messageDelete').text();
            jQuery('#modalDelContent').html(messageDelete + ' ' + name + '?');
            jQuery('#modalDel').foundation('reveal', 'open');
        };
        $scope.submitDel = function (id) {
            apiService.delete( id ).then(function (response) {
                $timeout(function () {
                    jQuery('#modalDel').foundation('reveal', 'close');
                    $scope.init(response.data);
                }, 1000);
            });
        };

        $scope.find = function () {
            $scope.fetched = false;
            if ( $scope.paging.PageNum == isDefined ){
                $scope.fetchPage( $scope.paging.PageNum );
            } else {
                $scope.fetchPage();
            }

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
        $scope.ngErrorRequired = function(form, elementName) {
            return ($scope[form][elementName].$error.required && $scope.submitted);
        };
        $scope.start_edit_options = false;
        jQuery('#modalEdit').bind('close', function() {
            $timeout(function() {
                $scope.start_edit_options = false;
            }, 100);

            $scope.start_edit_partner = false;
        });
        jQuery('#modalEdit').bind('open', function() {
            $scope.start_edit_options = true;

        });

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