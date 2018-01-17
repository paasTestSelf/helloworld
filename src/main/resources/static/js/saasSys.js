/**
 * Created by lubin on 2017/3/22.
 */



var saasSys = function () {
    /**
     * 查询配置
     * @type {string}
     */
    var el = 'body';
    var addLay = null,checkLay = null;

    var searchObj = {
        pageNum: 1,
        pageSize: 10,
        saasUserName:""
    };

    /**
     * 添加系统--校验配置
     */
    var validateSys = {
        rules: {
            saasName : {
                required : true,
                maxlength: 50
            }
        },
        messages : {
            saasName : {
                required : '请输入SaaS系统名称！',
                maxlength : '最大长度不能超过50个字符！'
            }
        },
        errorPlacement: function(error, element) {
            if (element.attr('name') == 'image'){
                error.appendTo($('#imageKey').parent());
            }
            else {
                error.appendTo(element.parent());
            }
        }

    };

    /**
     * 添加子系统--校验配置
     */
    var validateSonSys = {
        rules: {
            sonSysName : {
                required : true,
                maxlength: 10
            }
        },
        messages : {
            sonSysName : {
                required : '请输入子系统名称！',
                maxlength : '最大长度不能超过10个字符！'
            }
        }
    };

    /**
     * 查询操作
     * */
    function doSearch() {
        searchObj.pageNum = 1;
        searchObj.saasUserName = $("#saasUser").val();
        renderPages(true);
    }
    /**
     * 页面载入初始化
     */
    function saasUserInfo() {


        var userId =$(this).parent().attr("data");
        var userName =$(this).text();
        var mobile = $(this).attr("data");
        var account = $(this).attr("name");
        if(userName!==''){
            saasPortal(userId,userName,account,mobile);

        }
    }

    /**
     * 添加子系统
     */
   function addSonSys() {


        addLay = layer.open({
            type: 1,
            title: '添加子系统',
            area: ['450px', '200px'],
            content: $("#addSon"),
            btn: ['保存','关闭'],
            btn1:function (index) {

                $("#addSonSysForm").validate(validateSonSys);
                if($("#addSonSysForm").valid()){
                var sonName = $("#sonSysName").val();
                var portalId = $("#saasName").attr("data");
                addSonSaasSysInfo(sonName,portalId);
                $("#sonSysName").val("");
                layer.close(index);
                }
            },
            btn2:function (index) {
                $("#addSonSysForm .error").removeClass("error");
                $("#sonSysName-error").remove();
                $("#sonSysName").val("");
                layer.close(index);
            }

        });


   }

    /**
     * 设置子系统页面
     * @param userId
     * @param userName
     */
    function saasSonSysSet() {

        var url="/saasSys/saasSonSysHtml.do";
        var userName =$("#saasSysUser").val();
        var userId = $("#saasSysUserId").val();
        var moduleId = $(this).closest("td").attr("data");
        ajaxCommonFun({
            type: 'GET',
            url: url,
            dataType:'html',
            data: {
                "userId":userId,
                "userName":userName,
                "moduleId":moduleId
            },
            success: function (res) {
                addLay = layer.open({
                    type: 1,
                    title: 'SaaS服务组合',
                    area: ['550px', '400px'],
                    content: res,
                    btn: ['提交','关闭'],
                    btn1:function (index) {
                       var len =  $("#add-resource option").length;
                        if(len<=0){
                            layer.msg("您未添加任何资源！");
                            return;
                        }
                        var arr = [];

                        for(var i=0;i<len;i++){
                            var $me = $("#add-resource option:eq("+i+")");
                            var sourceId = $me.attr("data");
                            var SaaSInfo = {
                                "sourceId":sourceId,
                            };
                            arr.push(SaaSInfo);
                        }

                        var infoList = {
                            "saaSInfoList":arr,
                            "moduleId":moduleId,
                            "userId":userId,
                            "userName":userName
                        }
                        addSaasSysResource(infoList);
                        layer.close(index);
                    },

                });
            }
        });
    }

    /**
     * 设置--添加所有资源
     */

    function addAllSource(){
        var source = $("#original-resource").html();
        if(!!source.trim()){
            $("#add-resource").append(source);
            $("#original-resource").html("");

        }

    }

    /**
     * 设置--添加选中的资源
     */

    function addOneSource(){

        var sourceText = $("#original-resource option:selected").text();
        var sourceData = $("#original-resource option:selected").attr("data");
        if(!!sourceText){
            var tp = "<option data="+sourceData+">"+sourceText+"</option>";
            $("#add-resource").append(tp);
            $("#original-resource option:selected").remove();

        }else{
            layer.msg("请选择需要添加的资源！");
        }

    }


    /**
     * 设置--移除所有资源
     */

    function removeAllSource(){
        var source = $("#add-resource").html();
        if(!!source.trim()){

            $("#original-resource").append(source);
            $("#add-resource").html("");

        }

    }

    /**
     * 设置--移除选中的资源
     */

    function removeOneSource(){

        var sourceText = $("#add-resource option:selected").text();
        var sourceData = $("#add-resource option:selected").attr("data");
        if(!!sourceText){
            var tp = "<option data="+sourceData+">"+sourceText+"</option>";
            $("#original-resource").append(tp);
            $("#add-resource option:selected").remove();

        }else{
            layer.msg("请选择需要移除的资源！");
        }

    }

    /**
     * 添加系统
     */
    function addSaasSysInfo(){

        $("#saasSysForm").validate(validateSys);
        if($("#saasSysForm").valid()){

            var imgSrc = $("#addImageIcon").attr("src");
            if(imgSrc=="../../image/nopic.png"){
                layer.msg("请上传系统Logo图片！");
                return;
            }

        var url="/saasSys/addSaasSys.do";
        var account = $("#saasSysAccount").val();
        var userId = $("#saasSysUserId").val();
        var mobile = $("#saasSysMobile").val();
        var portalId = $("#saasName").attr("data");
        var saasPortalVo = {
            "id":portalId,
            "userId":userId,
            "account":account,
            "mobile":mobile,
            "logoUri":$("#imageKey").val(),
            "name":$("#saasName").val(),

        }
        $.ajax({
            type: 'POST',
            url: url,
            dataType:'json',
            data: JSON.stringify(saasPortalVo),
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                if(res.code == "000000"){
                    layer.msg(res.message);
                    $("#imageKey").val("");
                }else{
                    layer.msg(res.message);
                }
            }
        });
        }
    }


    /**
     * 添加子系统
     */
    function addSonSaasSysInfo(name,saasPortalId){

        var url="/saasSys/addSonSaasSys.do";
        var module = {
            "saasPortalId":saasPortalId,
            "name":name,
            "createdUserId":$("#saasSysUserId").val()

        }
        $.ajax({
            type: 'POST',
            url: url,
            dataType:'json',
            data: JSON.stringify(module),
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                if(res.code == "000000"){
                    var userId = $("#saasSysUserId").val();
                    var userName =$("#saasSysUser").val();
                    var account =$("#saasSysAccount").val();
                    var mobile =$("#saasSysMobile").val();
                    saasPortal(userId,userName,account,mobile)
                    layer.msg(res.message);
                }else{
                    layer.msg(res.message);
                }
            }
        });
    }

    /**
     * 添加子系统下的资源
     */
    function addSaasSysResource(listInfo){
        var url="/saasSys/addSonSaasResource.do";


        $.ajax({
            type: 'POST',
            url: url,
            dataType:'json',
            data: JSON.stringify(listInfo),
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                if(res.code == "000000"){
                    var userId = $("#saasSysUserId").val();
                    var userName =$("#saasSysUser").val();
                    var account =$("#saasSysAccount").val();
                    var mobile =$("#saasSysMobile").val();
                    saasPortal(userId,userName,account,mobile)
                    layer.msg(res.message);
                }else{
                    layer.msg(res.message);
                }
            }
        });
    }

    /**
     * 删除子系统以及关联的资源
     */
  function delSonSysAndRes(){
        var moduleId = $(this).closest("td").attr("data");
        layer.confirm('您确定删除该子系统吗?', {
            btn: ['确定','取消']
        }, function(index){
            var url="/saasSys/delSonSys.do";

            ajaxCommonFun({
                type: 'GET',
                url: url,
                data: {
                    "moduleId":moduleId
                },
                success: function (res) {
                    if(res.code == "000000"){
                        var userId = $("#saasSysUserId").val();
                        var userName =$("#saasSysUser").val();
                        var account =$("#saasSysAccount").val();
                        var mobile =$("#saasSysMobile").val();
                        saasPortal(userId,userName,account,mobile)
                        layer.msg(res.message);
                    }else{
                        layer.msg(res.message);
                    }
                }
            });
            layer.close(index)
        }, function(){

        });
    }
    /**
     * 重置按钮
     */
   function resetInfo() {
        $("#saasName").val("");
        $("#addImageIcon").attr("src","../../image/nopic.png");

    }



    /**
     * 获取saas用户信息
     * @param isFirst
     */
    function renderPages(isFirst) {
        var url="/saasSys/listSaasUser.do";
        ajaxCommonFun({
            type: 'GET',
            url: url,
            dataType:'html',
            data: searchObj,
            success: function (res) {
                $("#maintanInfoList").html(res);
                if(isFirst){
                    buildPageArea();
                }
                var userId =$(".info:eq(0)").attr("data");
                var userName =$(".info:eq(0) a").text();
                var mobile = $(".info:eq(0) a").attr("data");
                var account = $(".info:eq(0) a").attr("name");
                if(userName!==''){
                    saasPortal(userId,userName,account,mobile);

                }
            }
        });
    }

    /**
     * 获取saas配置信息
     *
     */
    function saasPortal(userId,userName,account,mobile) {
        var url="/saasSys/saasPortal.do";
        ajaxCommonFun({
            type: 'GET',
            url: url,
            dataType:'html',
            data: {
                "userId":userId,
                "userName":userName
            },
            success: function (res) {
                $("#saasPortal").html(res);
                $("#saasSysUser").val(userName);
                $("#saasSysAccount").val(account);
                $("#saasSysUserId").val(userId);
                $("#saasSysMobile").val(mobile);
            }
        });
    }

    /**
     * 文件上传
     * */
    function uploadFile(field){
        var $parent = $(field).parent();
        var img  = '<input class="imgFile" enctype="multipart/form-data" name="image" type="file">';
        var $form = $('<form enctype="multipart/form-data" style="display:none"></form>').append(field);
        $('body').append($form);
        $form.ajaxSubmit({
            type: 'POST',
            url: '/uploadFile.do',
            dataType:"json",
            success: function (t) {
                $form.remove();
                if(t.status=='ERROR'){
                    layer.msg(t.message);
                    $parent.prepend(img);
                }else{
                    layer.msg("上传成功！");
                    $("#addImageIcon").attr("src",t.result.imageUri);
                    $("#imageKey").val(t.result.imageKey);
                    $parent.find("img").before(field);

                }

            },
            error: function(){
                $form.remove();
                layer.msg("系统异常！");
                $('.imgFile').val("");
                $parent.prepend(img);
            }
        });

    }

    function doUploadFile(){
        var me = this;
        var filePath = $(this).val();
        if(filePath!="" || $.trim(filePath)!=""){
            uploadFile(me);
        }
    };

    /**
     * 页面初始化和事件绑定
     * */
    function bindEvents() {

        $(el).undelegate()
            .delegate('#clear','click',resetInfo)
            .delegate('#saasUserInfo','click',saasUserInfo)
            .delegate('#addSonSysBtn','click',addSonSys)
            .delegate('.sysSetting','click',saasSonSysSet)
            .delegate('#selectAll','click',addAllSource)
            .delegate('#selectOne','click',addOneSource)
            .delegate('#removeAll','click',removeAllSource)
            .delegate('#removeOne','click',removeOneSource)
            .delegate('input[type="file"]','change',doUploadFile)
            .delegate('#save','click',addSaasSysInfo)
            .delegate('.sysDel','click',delSonSysAndRes)
            .delegate('#searchUserInfo','click',doSearch)


    }


    /**
     * 分页
     * */
    function doChangePage(num) {
        searchObj.pageNum = num;
        renderPages();
    }
    function buildPageArea() {
        var pageAllCount = $('#pageAllCount').val(),
            totalPage = Math.ceil(pageAllCount/searchObj.pageSize);
        laypage({
            cont: 'page',
            pages: totalPage,
            totalCount:pageAllCount,
            curr: searchObj.pageNum,
            jump: function(obj, first){
                if(!first){
                    doChangePage(obj.curr);
                }
            }
        });
    }

    function init() {

        renderPages(true);
        bindEvents();


    }
    init();




};



