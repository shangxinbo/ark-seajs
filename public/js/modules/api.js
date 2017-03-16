
define(function (require, exports, module) {
    window.API = {
        login: '/users/login',
        message_list: '/message/list',
        message_delete: '/message/delete',
        message_count: '/message/count',
        message_read: '/message/read',
        user_access: '/users/access',
        user_delete: '/users/delete',
        user_disable: '/users/disable',
        user_find: '/users/find',
        user_list: '/users/list',
        logout: '/users/logout',
        lostcontactrep_list: '/lostcontactrep/list',
        lostcontactrep_download: '/lostcontactrep/download',
        lostcontactrep_template: '/lostcontactrep/template',
        lostcontactrep_upload: '/lostcontactrep/upload',
        get_user_info: '/users',
        register: '/users/register',
        user_update: '/users/update-info',
        user_password: '/users/update-password',
        module_list: '/filter/modulefilter',
        filter_getFixedProperty: '/filter/basetags',
        filter_getTagChildren: '/filter/leaftags',
        filter_getTagStructure: '/filter/subtags',
        filter_searchdim: '/analyse/multi',
        filter_searchline: '/analyse/chart',
        template_list: '/filter/filterlist',
        template_delete: '/filter/delete',
        template_save: '/filter/savefilter',
        template_list_layer: '/filter/filterapply',
        tags_cycledata: '/privatetags/cycledata',
        tags_stagefail: '/privatetags/stagefail',
        tags_list: '/privatetags/list',
        tags_template: '/privatetags/template',
        tags_download: '/privatetags/downloadsingle',
        tags_upload: '/privatetags/upload',
        tags_feedbackdata: '/privatetags/feedbackdata',
        tags_downloaddata: '/stockProject/downloadProject',
        upload_list: '/upload/list',
        upload_delete: '/upload/delete',
        upload: '/upload/uploadfile',
        upload_list_layer: '/upload/apply',
        upload_template: '/upload/download',
        project_my_list: '/project/list',
        project_all_list: '/project/alllist',
        project_stock_list: '/stockProject/listProject',
        project_delete: '/project/delete',
        project_historytemplate: '/template/historytemplate',
        project_start: '/project/startup',
        project_stop: '/project/stop',
        project_close: '/project/close',
        project_uptemplate: '/template/usetemplate',
        project_isuploadfeed: '/stockProject/isuploadfeed',
        filtertag_selectnumber: '/filtertag/selectnumber',
        filtertag_produces: '/filtertag/products',
        filtertag_produce: '/filtertag/product',
        filtertag_preferences: '/filtertag/preferences',
        filtertag_preference: '/filtertag/preference',
        filtertag_channels: '/filtertag/channels',
        filtertag_channel: '/filtertag/channel',
        filtertag_region: '/filtertag/region',
        filtertag_actions: '/filtertag/actions',
        filtertag_action: '/filtertag/action',
        stockProject_saveProject: '/stockProject/saveProject',
        project_savetemplate: '/template/savetemplate',
        templateInfo: '/template/templateInfo'
    }
})

