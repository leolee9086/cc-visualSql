(function($) {
    $.fn.queryBuilder = function(config) {
        //判断要绑定的是否是一个JQuery对象
        if (this.size() != 1)
            $.error('请将该事件正确绑定到一个jQuery对象中！');

        var defaultSou = {
            sourceData : [],//元数据
            saveJson : {},//保存的查询结构
            propertiesTypes:"",//属性-类型-值 对应关系
            onPageClicked : null, //回调函数
            onSQLBuild : null,//返回获取的SQL的回调函数
            submitButton:"", //产生获取SQL的组件id
            SQLButton:"",  //获取SQL语句的组件id
            SQL_reset:""
        };

        return this.each(function() {
            var $this = $(this);
            var is_error = false;  //监控是否存在错误
            if (config)
                $.extend(defaultSou, config);

            /**
             *
             * @param txt 摇格式化或压缩的json格式的字符串
             * @param compress 是否压缩
             * @returns {string}
             */
            function formatJson(txt,compress/*是否为压缩模式*/){/* 格式化JSON源码(对象转换为JSON文本) */
                var indentChar = '    ';
                if(/^\s*$/.test(txt)){
                    alert('数据为空,无法格式化! ');
                    return;
                }
                try{var data=eval('('+txt+')');}
                catch(e){
                    alert('数据源语法错误,格式化失败! 错误信息: '+e.description,'err');
                    return;
                };
                var draw=[],last=false,This=this,line=compress?'':'\n',nodeCount=0,maxDepth=0;

                var notify=function(name,value,isLast,indent/*缩进*/,formObj){
                    nodeCount++;/*节点计数*/
                    for (var i=0,tab='';i<indent;i++ )tab+=indentChar;/* 缩进HTML */
                    tab=compress?'':tab;/*压缩模式忽略缩进*/
                    maxDepth=++indent;/*缩进递增并记录*/
                    if(value&&value.constructor==Array){/*处理数组*/
                        draw.push(tab+(formObj?('"'+name+'":'):'')+'['+line);/*缩进'[' 然后换行*/
                        for (var i=0;i<value.length;i++)
                            notify(i,value[i],i==value.length-1,indent,false);
                        draw.push(tab+']'+(isLast?line:(','+line)));/*缩进']'换行,若非尾元素则添加逗号*/
                    }else   if(value&&typeof value=='object'){/*处理对象*/
                        draw.push(tab+(formObj?('"'+name+'":'):'')+'{'+line);/*缩进'{' 然后换行*/
                        var len=0,i=0;
                        for(var key in value)len++;
                        for(var key in value)notify(key,value[key],++i==len,indent,true);
                        draw.push(tab+'}'+(isLast?line:(','+line)));/*缩进'}'换行,若非尾元素则添加逗号*/
                    }else{
                        if(typeof value=='string')value='"'+value+'"';
                        draw.push(tab+(formObj?('"'+name+'":'):'')+value+(isLast?'':',')+line);
                    };
                };
                var isLast=true,indent=0;
                notify('',data,isLast,indent,false);
                return draw.join('');
            }

            /**
             * 初始化一个and 、or连接符
             *
             * @param name 单选组件的name 属性值
             * @param checkVal 初始化默认选中值
             *
             * @returns {*|jQuery}
             */
            function new_left_op(name,checkVal){
                var lefi_div = $(' <div class="btn-group btn-group-xs group_left" data-toggle="buttons">')
                lefi_div.append('<label class="btn btn-primary"><input type="radio" name="'+name+'" autocomplete="off" value="and" checked>并且</label><label class="btn btn-primary"><input type="radio" name="'+name+'" value="or" autocomplete="off"> 或者</label>');
                lefi_div.find("> .btn input[type=radio][value="+checkVal+"]").attr("checked",'checked');
                lefi_div.find("> .btn input[type=radio][value="+checkVal+"]").parents('label:first').addClass('active');
                return lefi_div;
            }

            /**
             * 获取SQL语句
             */
            function bind_SQL_event(){
                var sql_btn = $('#'+defaultSou.SQLButton);
                if(sql_btn.length !=1){
                    $.error = "请绑定一个获取SQL的正确的组件id";;
                }
                sql_btn.on('click', function () {
                    var parDiv =  $this.find("> .builder_main");
                    is_error = false;
                    remove_error(parDiv);
                    var result_sql_json = get_SQL_Str(parDiv);
                    if(is_error){
                        return false;
                    }

                    var sql = "SELECT * FROM blocks WHERE" + get_sql(result_sql_json);

                    tipSource = defaultSou.onSQLBuild.call(this,sql,0);
                })
            }

            function reset_sql(){
                //$this.empty();
                var sql_btn = $('#'+defaultSou.SQL_reset);
                if(sql_btn.length !=1){
                    $.error = "请绑定一个重置SQL的正确的组件id";;
                }

                sql_btn.on('click', function () {
                   $this.empty();
                    builderSQL(defaultSou.sourceData,defaultSou.saveJson,$this,false,0);
                    bind_submit_event();
                    bind_SQL_event();
                    reset_sql();
                });

            }

            function get_sql (structure){
                var sql = '';

                var oprator = structure.oprator;
                var rules = structure.rules;
                $.each(rules,function(i){
                    if(i > 0){
                        sql += structure.oprator;
                    }
                    sql += " "+this.alia+'.'+this.property+' '+ this.consy +' ';

                    var value = this.value;
                    if(value instanceof Array){
                        sql+=' ( '+ value.join(',')+" ) ";
                    }else if(value instanceof Object){
                        sql += ' '+value.alia+'.'+value.property+' ';
                    }else
                        if(value.indexOf(",") != -1 )
                        {
                            value = '"' + value + '"';
                            value = value.replace(/,/g,'","')
                        }
                        else
                        {
                            value = '"' + value + '"';
                        }
                        sql += ' '+value+' ';
                });


                var ruleGroups =  structure.rulesGroup;
                $.each(ruleGroups,function(m){
                    sql += structure.oprator +' ( ';
                    sql +=get_sql(ruleGroups[m])+" ) ";
                });

                return sql ;
            };


            function bind_submit_event(){
                var sub = $('#'+defaultSou.submitButton);
                if(sub.length !=1)
                    $.error = "请绑定一个正确的获取SQL结构的组件id";

                sub.on('click',function(){
                    //处理获取SQL结构的逻辑
                   var parDiv =  $this.find("> .builder_main");
                    is_error = false;
                    remove_error(parDiv);
                   var result_sql_json = get_SQL_Str(parDiv);
                    if(is_error){
                        return false;
                    }
                    tipSource = defaultSou.onSQLBuild.call(this,formatJson(JSON.stringify(result_sql_json)),1);
                });
            }

            function remove_error (parDiv){
                parDiv.find("> .querystmts .sin_con").each(function(){
                    $(this).find('> .sin_key').removeClass('has-error');
                    $(this).find('> .sin_connect').removeClass('has-error');
                    $(this).find('> .sin_val').removeClass('has-error');
                    $(this).find('> .sin_op .error').remove();
                });
                parDiv.find('> .builder_main').each(function(){
                    remove_error($(this));
                });
            }

            function get_SQL_Str(parDiv){
                var result =  {};
                var rules = [];

                var oprator = parDiv.find('> .l_op .group_left .btn input[type="radio"]:checked ').val();
                result.oprator = oprator;
                parDiv.find("> .querystmts .sin_con").each(function(){
                    var rule = {};
                    var sin_key = $(this).find('> .sin_key .fir_sele').val().split('.');
                    rule.entity = sin_key[0];
                    rule.alia = sin_key[1];
                    rule.property = sin_key[2];
                    rule.type = sin_key[3];

                     var sin_con = $(this).find('> .sin_connect .op_sele').val();
                    rule.consy = sin_con;


                    var sin_val_div = $(this).find('> .sin_val');;

                    var method = '';
                    $.each(defaultSou.propertiesTypes,function(n){
                        //alert(sin_key[3]);
                        if(sin_key[3] in defaultSou.propertiesTypes[n]){
                            var types = defaultSou.propertiesTypes[n][sin_key[3]];
                            $.each(types,function(q){
                                if(sin_con == types[q].value){
                                    method=types[q].inputType;
                                    return false;
                                }
                            });
                            return false;
                        }
                    });
                    if(method == '')
                        $.error('请您确定如何获取自定义组件的值的方法！');
                   var temp_result =  methods[method].get_(sin_val_div);
                    if(temp_result.title == 'success'){
                        rule.value = temp_result.value;
                    }else{
                        is_error = true;
                        var err_span = $('<span class="glyphicon glyphicon-warning-sign '+temp_result.title+'" style="cursor: help;" aria-hidden="true" data-toggle="tooltip" data-placement="left" title="'+temp_result.msg+'"></span>');
                        temp_result.node.parents('.sin_val:first').addClass('has-error');
                        //根据错误地方添加错误显示信息
                        var remove_img = temp_result.node.parents('.sin_val:first').next('.sin_op').find('> .remove');
                        remove_img.before(err_span);
                        err_span.tooltip();
                        $.error = result.msg;
                    }
                    //rule.value = "s";
                    rules.push(rule);
                });
                var rulesGroup = [];
                result.rules = rules;
                parDiv.find('> .builder_main').each(function(){
                    rulesGroup.push(get_SQL_Str($(this)));
                });
                result.rulesGroup = rulesGroup;
                return result;
            };

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
                div.append('<img src="css/images/2.png" alt="Remove" class="remove '+(delIsDis?"del":"head")+'" />');

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
                    sin_div = init_sin_con(defaultSou.sourceData,(i == 0?  false:true));
//    		 var key_sin = sin_div.find('.sin_key');
                }else{
                    sin_div = $('<div class="sin_con">');
                    var sin_key = $('<div class="sin_key">');
                    var fir_sele = new_fir_select(defaultSou.sourceData);
                    fir_sele.val(rule.entity+"."+rule.alia+"."+rule.property+"."+rule.type);  //设置选中
                    sin_key.append(fir_sele);//没有设置选中
                    sin_div.append(sin_key);

                    var sec_div = $('<div class="sin_connect">');
                    var propertypeType = rule.type;
                    var consy = rule.consy;
                    var proIsExist = false;
                    var sec_sel = null;
                    $.each(defaultSou.propertiesTypes,function(m){
                        //key 存在
                        if(propertypeType in defaultSou.propertiesTypes[m]){
                            sec_sel = new_op_select(defaultSou.propertiesTypes[m][propertypeType]);
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

                    var inputType = "", tip = "", method = false,source = false;

                    $.each(defaultSou.propertiesTypes,function(m){
                        //alert(JSON.stringify(propertiesTypes[m]))
                        //key 存在
                        if(type in defaultSou.propertiesTypes[m]){
                            var types = defaultSou.propertiesTypes[m][type];
                            $.each(types,function(n){
                                if(con == types[n].value){
                                    inputType =  types[n].inputType;
                                    tip = types[n].tip;
                                    method=types[n].callBack;
                                    source = types[n].source;
                                    return false;
                                }
                            });
                            return false;
                        }
                    });


                    var static_data = {'tip':tip,'value':''};

                    var tipSource = null;
                    //判断是触发的什么类型的连接符，如果是系统默认的方法
                    if(method){
                        //需要回调函数
                        tipSource = defaultSou.onPageClicked.call(this,entity,property,type);
                    }else if(source){
                        //alert(source);
                        //foreign
                        tipSource = defaultSou.sourceData;
                    }else
                        tipSource = null;

                    var th_div = $(this).parents('.sin_connect:first').next('.sin_val');
                    th_div.empty();
                    //找到这个方法
                    if(inputType in methods){
                        var val_input = methods[inputType].new_(static_data,tipSource);
                        th_div.append(val_input);
                    }else{
                        if(inputType == "" ){
                            //针对这个类型的属性没有定义对应的组件追加的方法
                            alert("自定义的"+type+"类型的属性"+property+"的连接符为"+con+"没有设置组件的追加方式，请修改全局参数propertiesTypes!");
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
                    $.each(defaultSou.propertiesTypes,function(m){
                        //alert(JSON.stringify(propertiesTypes[m]))
                        //key 存在
                        if(all[3] in defaultSou.propertiesTypes[m]){
                            sec_sel = new_op_select(defaultSou.propertiesTypes[m][all[3]]);
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
             * @param i 遍历节点
             **/
            function builderSQL(source_data,save_data,parNode,groupIsDis,i){

                var count = 0;
                var checkVal  =  null;
                try{
                    checkVal = save_data.oprator;;
                }catch(e) {
                    checkVal = 'and';
                }
                var par_div = $('<div class="builder_main" align="center">');
                var op_div = $('<div class="l_op">');
                op_div.append(new_left_op(i,checkVal));
                var right_div = new_rig_op(groupIsDis);
                op_div.append(right_div);
                right_div.find('button').eq(0).on('click',function(){
                    //追加一个规则
                    $(this).parents('.l_op:first').next().append(new_rule(null,1));
                });
                right_div.find('button').eq(1).on('click',function(){
                    //新增一个嵌套规则组
                    var par = $(this).parents('.builder_main:first');

                    builderSQL(source_data,null,par,true,i+'_'+(++count));
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
                $.each(rulesGroup, function (m) {
                    builderSQL(source_data,this,par_div,true,i+'_'+m);
                });
                //});
            }

            builderSQL(defaultSou.sourceData,defaultSou.saveJson,$this,false,0);
            bind_submit_event();
            bind_SQL_event();
            reset_sql();
        });


    };
})(jQuery);