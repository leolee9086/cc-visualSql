
$(function(){

     /**
      * 初始化一个and 、or连接符
      * @returns {*|jQuery}
      */
     function new_left_op(){
         var lefi_div = $(' <div class="btn-group btn-group-xs group_left" data-toggle="buttons">')
         lefi_div.append('<label class="btn btn-primary active"><input type="radio" name="options" autocomplete="off" value="and" checked>并且</label><label class="btn btn-primary"><input type="radio" name="options" value="or" autocomplete="off"> 或者</label>');
         return lefi_div;
     }

     /***
      * 初始化组级联操作
      * @param groupIsDis 删除组是否显
      * @returns {jQuery|HTMLElement}
      */
    function new_rig_op(groupIsDis){
         var rig_div = $('<div class="btn-group btn-group-xs group_right" role="group" aria-label="...">');
         rig_div.append('<button type="button" class="btn btn-primary"><span class="glyphicon glyphicon-align-justify" aria-hidden="true"></span>&nbsp;添加新行</button><button type="button" class="btn btn-info"><span class="glyphicon glyphicon-align-left" aria-hidden="true"></span>&nbsp;添加新组</button><button type="button" class="btn btn-xs btn-danger" style="display: '+(groupIsDis?"block":"none")+'"><span class="glyphicon glyphicon-trash" aria-hidden="true" ></span>&nbsp;删除组</button>');
        return rig_div;
    }

    /***
     * 初始化删除行操作组件
     * @param delIsDis 删除行标签是否显示
     * @returns {jQuery|HTMLElement}
     */
    function new_op_del(delIsDis){
    	var div = $('<div class="sin_op">');
    	div.append('<img src="css/images/2.png" alt="Remove" class="remove '+(delIsDis?"del":"head")+'" >');
    	
    	div.find('.del').on('click',function(){
    		//删除一行数据
    		$(this).parents('.sin_con:first').remove();
    	});
    	return div;
    }
    
    
   /**
     * 生成第一个下拉组件
     * @param sour_data 下拉组件的元数据
     * @auther GuoPengfei
     * @returns {*|jQuery}
     */
    function new_fir_select(sour_data){
        var select = $('<select>').addClass("form-control selectpicker bs-select-hidden mobile-device fir_sele");
       select.append('<option >请选择</option>');
        $.each(sour_data,function(i,j){
            var entityName = this.entityName;
            var alias = this.alias;
            var properties = this.properties;
            $.each(alias,function(n,m){
                var group = $('<optgroup>').attr('label',entityName+"."+alias[n]);
                $.each(properties,function(o,p){
                    group.append('<option value="'+entityName+"."+alias[n]+"."+this.name+"."+this.type+'">'+this.name+'</option>');
                });
                select.append(group);
            });
        });
        return select;
    }


    /**
     * 生成一个key-value连服下拉组件
     * @param options  下拉的组件
     * @returns {*|jQuery}
     */
    function new_op_select(options){
        var select = $('<select>').addClass("form-control selectpicker bs-select-hidden mobile-device op_sele");
        $.each(options,function(i,j){
            select.append('<option value="'+this.value+'">'+this.text+'</option>');
        });
        return select;
    }
     
     /**
      * 初始化第一个规则
      * @param sourceJson  元数据
      * @param isDisplayDel  删除按钮是否显示
      * 
      * @returns {*|jQuery}
      */
     function init_sin_con (sourceJson,isDisplayDel){
    	 var sin_div = $('<div class="sin_con">');
    	 var sin_key = $('<div class="sin_key">');
    	 sin_key.append(new_fir_select(sourceJson));
    	 sin_div.append(sin_key).append('<div class="sin_connect">').append('<div class="sin_val">').append(new_op_del(isDisplayDel));
    	 return sin_div;
     }

     /**
      * 初始化一个规则
      * @param rule  待恢复的规则
      * @param i  第几个规则
      * 
      * @returns {*|jQuery}
      */
     var new_rule = function(rule,i){
    	 var sin_div = null;
    	 if(rule == null || rule == ""){
    		 sin_div = init_sin_con(sourceData,(i == 0?false:true));
//    		 var key_sin = sin_div.find('.sin_key');
    	 }else{
    		 sin_div = $('<div class="sin_con">');
             var sin_key = $('<div class="sin_key">');
             var fir_sele = new_fir_select(sourceData);
             fir_sele.val(rule.entity+"."+rule.alia+"."+rule.property+"."+rule.type);  //设置选中
             sin_key.append(fir_sele);//没有设置选中
             sin_div.append(sin_key);

             var sec_div = $('<div class="sin_connect">');
             var propertypeType = rule.type;
             var consy = rule.consy;
             var proIsExist = false;
             var sec_sel = null;
             $.each(propertiesTypes,function(m){
                 //key 存在
                 if(propertypeType in propertiesTypes[m]){
                     sec_sel = new_op_select(propertiesTypes[m][propertypeType]);
                     sec_sel.val(consy);
                     proIsExist = true;
                     return false;
                 }
             });
             /**
              *进行判断选择的属性类型是否存在
              */
             if(!proIsExist){
                 alert("选择的属性"+this.entity+"."+this.alia+"的类型"+this.property+"没有对应的连接符，请确认是否添加此类型映射");
                 return false;
             }
             sec_div.append(sec_sel);

          	
             var th_div = $('<div class="sin_val">');
             //此处可以通过propertypeType来确定要生成什么类型的ipnut输入值
//             th_div.append('<input type="text" class="form-control" />');
             
             var for_div = new_op_del((i == 0?false:true));
             
             sin_div.append(sec_div).append(th_div).append(for_div);
             bind_se_event(sec_div);
             sec_div.find('.op_sele').change();
             
    	 }
         bind_fi_event(sin_div);
         return sin_div;
     };
     
     
     /**
      * 给连接符绑定事件
      * @param par_div 连接符所在的父类div jquery 对象
      */
     var bind_se_event = function(par_div){
    	    //第二个下拉发生改变
    	 par_div.find('.op_sele').on('change',function(){
        	 //根据选择的树形类型和连接符，确定是否调用回调函数，如果需要调用回调函数，则需要等待接收回掉函数的返回值，并作用于等待填充的待选值的提示信息
        	 var con = $(this).val();
        	 var fullKey = $(this).parent().prev().find('select').val();
        	 var temp = fullKey.split('.');
        	 var entity = temp[0];
//        	 var alia = temp[1];
        	 var property = temp[2];
        	 var type = temp[3];
        	 
        	 var inputType = "";
        	 var tip = "";
        	 $.each(propertiesTypes,function(m){
                 //alert(JSON.stringify(propertiesTypes[m]))
                 //key 存在
                 if(type in propertiesTypes[m]){
                	 var types = propertiesTypes[m][type];
                	 $.each(types,function(n){
                		 if(con == types[n].value){
                			inputType =  types[n].inputType;
                			tip = types[n].tip;
                			return false;
                		 }
                	 });
                     return false;
                 }
             });
        	 
        	 var static_data = {'tip':tip,'value':''};
        	 
        	 var tipSource = huidiao(entity,property);
//        	 var th_div = $('<div class="sin_val">');
        	 var th_div = $(this).parents('.sin_connect:first').next('.sin_val');
        	 th_div.empty();
        	 //找到这个方法
        	 if(inputType in methods){
        			 var val_input = methods[inputType](static_data,tipSource);
        			 th_div.append(val_input);
             }else{
            	 if(inputType == "" ){
            		 //针对这个类型的属性没有定义对应的组件追加的方法
            		 alert("自定义的"+type+"类型的属性"+property+"的连接符为"+con+"没有设置组件的追加方式，请修该全局参数propertiesTypes!");
            	 }else
            		 if(inputType != null && inputType !='null' ){
            		 alert("您在全局方法中定义的方法"+con+"没有对应的实现方法，请在queryBuilder.methos.js文件中的methods参数中写入自定义参数类型所对应的追加组件的方法!");
            	 }
             }
         });
     };
     
     /**
      * 给连接符绑定事件
      * @param par_div 连接符所在的父类div jquery 对象
      */
     var bind_fi_event = function(par_div){
    	//第一个下拉发生改变
    	 par_div.find('.fir_sele').on('change',function(){
        	 var fullTemp = $(this).val();
        	 var all = fullTemp.split('.');
//        	 var sec_div = $('<div class="sin_connect">');
        	 var sec_div =  $(this).parents('.sin_key:first').next('.sin_connect');
        	 sec_div.empty();
        	 var sec_sel = null;
             $.each(propertiesTypes,function(m){
                 //alert(JSON.stringify(propertiesTypes[m]))
                 //key 存在
                 if(all[3] in propertiesTypes[m]){
                     sec_sel = new_op_select(propertiesTypes[m][all[3]]);
                     proIsExist = true;
                     return false;
                 }
             });
             sec_div.append(sec_sel);
//             $(this).parents('.sin_key').next().remove();
             sec_div.next().empty();
//             $(this).parents('.sin_key').after(sec_div);
             
             bind_se_event(sec_div);
             sec_div.find('.op_sele').change();
         });

     };
     
     
     /**
      * 构建SQL Builder主方法
      * @param source_data 元数据
      * @param save_data  保存的SQL结构, 至少为[]数组
      * @param parNode 父类节点对象
      * @param ruleIsDis 删除规则是否显示
      **/
     function builderSQL(source_data,save_data,parNode,groupIsDis){

         var par_div = $('<div class="builder_main" align="center">');
         var op_div = $('<div class="l_op">');
         op_div.append(new_left_op());
         var right_div = new_rig_op(groupIsDis);
         op_div.append(right_div);
         right_div.find('button').eq(0).on('click',function(){
        	 //追加一个规则
        	 $(this).parents('.l_op:first').next().append(new_rule(null,1));
         });
         right_div.find('button').eq(1).on('click',function(){
        	 //新增一个嵌套规则组
        	 var par = $(this).parents('.builder_main:first');
        	 builderSQL(source_data,null,par,true);
         });
         right_div.find('button').eq(2).on('click',function(){
        	 $(this).parents('.builder_main:first').remove();
         });
          
         par_div.append(op_div);
         
         var  querystmts = $('<div class="querystmts">');

         if(save_data == null || save_data == undefined || save_data == "" || 0 >= save_data.length){
             //仅仅创建一个空白的界面，没有保存的额SQL结构
        	 var null_sin_con = init_sin_con(source_data);
        	 querystmts.append(null_sin_con);
        	 par_div.append(querystmts);
        	 parNode.append(par_div);
        	 bind_fi_event(null_sin_con);
             return false;
         }
    	 
         var rules = save_data.rules;
         $.each(rules, function (i) {
             //每条规则
                 querystmts.append(new_rule(this,i));
             });
         	par_div.append(querystmts);
            parNode.append(par_div);
             //规则组
             var rulesGroup = save_data.rulesGroup;
             $.each(rulesGroup, function () {
                 builderSQL(source_data,this,par_div,true);
             });
         //});
     } 

     builderSQL(sourceData,saveJson,$('#sql_builder'),false);

  });
 
 
 var huidiao = function(entity,property){
	 return null;
 };