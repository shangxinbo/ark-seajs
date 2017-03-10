/**
 * NAME 2016/8/24
 * DATE 2016/8/24
 * AUTHOR shangxinbo
 */

define(function (require, exports, module) {
    var environment = window.ENV ? window.ENV : 'java';
    if (environment == 'java') {
        window.API = {
            login: '/data/auth',
            module_list: '/data/cumodel/dataGrid',
            filter_getFixedProperty: '/data/filter/getFixedProperty',
            filter_getTagChildren: '/data/filter/getTagChildren',
            filter_getTagStructure: '/data/filter/getTagStructure',
            filter_searchdim: '/data/filter/searchdim',
            filter_searchline: '/data/filter/searchline',
            template_list: '/data/template/dataGrid',
            template_delete: '/data/template/delete',
            template_save: '/data/template/save',
            upload_list: '/data/upload/history/dataGrid',
            upload_delete: '/data/upload/history/delete',
            upload: '/data/upload',
            get_user_info: '/data/currentuser',
            logout: '/data/logout'
        };
    } else {
        window.API = {
            login: '/php/users/login',
            message_list:'/php/message/list',
            message_delete:'/php/message/delete',
            message_count:'/php/message/count',
            message_read:'/php/message/read',
            user_access: '/php/users/access',
            user_delete: '/php/users/delete',
            user_disable: '/php/users/disable',
            user_find: '/php/users/find',
            user_list: '/php/users/list',
            logout: '/php/users/logout',
            lostcontactrep_list: '/php/lostcontactrep/list',
            lostcontactrep_download: '/php/lostcontactrep/download',
            lostcontactrep_template: '/php/lostcontactrep/template',
            lostcontactrep_upload: '/php/lostcontactrep/upload',
            get_user_info: '/php/users',
            register: '/php/users/register',
            user_update: '/php/users/update-info',
            user_password: '/php/users/update-password',
            module_list: '/php/filter/modulefilter',
            filter_getFixedProperty: '/php/filter/basetags',
            filter_getTagChildren: '/php/filter/leaftags',
            filter_getTagStructure: '/php/filter/subtags',
            filter_searchdim: '/php/analyse/multi',
            filter_searchline: '/php/analyse/chart',
            template_list: '/php/filter/filterlist',
            template_delete: '/php/filter/delete',
            template_save: '/php/filter/savefilter',
            template_list_layer: '/php/filter/filterapply',
            tags_cycledata: '/php/privatetags/cycledata',
            tags_stagefail: '/php/privatetags/stagefail',
            tags_list: '/php/privatetags/list',
            tags_template: '/php/privatetags/template',
            tags_download: '/php/privatetags/downloadsingle',
            tags_upload: '/php/privatetags/upload',
            tags_feedbackdata: '/php/privatetags/feedbackdata',
            tags_downloaddata: '/php/stockProject/downloadProject',
            upload_list: '/php/upload/list',
            upload_delete: '/php/upload/delete',
            upload: '/php/upload/uploadfile',
            upload_list_layer: '/php/upload/apply',
            upload_template:'/upload/download',
            project_my_list:'/php/project/list',
            project_all_list:'/php/project/alllist',
            project_stock_list:'/php/stockProject/listProject',
            project_delete:'/php/project/delete',
            project_historytemplate:'/php/template/historytemplate',
            project_start:'/php/project/startup',
            project_stop:'/php/project/stop',
            project_close:'/php/project/close',
            project_uptemplate:'/php/template/usetemplate',
            project_isuploadfeed:'/php/stockProject/isuploadfeed',
            filtertag_selectnumber:'/php/filtertag/selectnumber',
            filtertag_produces:'/php/filtertag/products',
            filtertag_produce:'/php/filtertag/product',
            filtertag_preferences:'/php/filtertag/preferences',
            filtertag_preference:'/php/filtertag/preference',
            filtertag_channels:'/php/filtertag/channels',
            filtertag_channel:'/php/filtertag/channel',
            filtertag_region:'/php/filtertag/region',
            filtertag_actions:'/php/filtertag/actions',
            filtertag_action:'/php/filtertag/action',
            stockProject_saveProject:'/php/stockProject/saveProject',
            project_savetemplate:'/php/template/savetemplate',
            templateInfo:'/php/template/templateInfo'
        };
    }
});

