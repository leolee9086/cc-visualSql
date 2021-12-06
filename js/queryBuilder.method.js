/**
 * 此方法中的每个参数对应的函数都必须传入两个值
 * static_data： 系统必须参数，包含以下键值对
 * 				tip: 新增组件的输入提示信息
 * 				value：新增组件的默认值,如果value对应的值包含多个，则这多个值组成数组
 * tipSource:必传参数，自定义传入数据的格式，主要来自于回调函数返回的值
 */
var methods = {
	new_date_in : {new_:function(static_data,tipSource) {
		var date_in = $('<input size="16" type="text" value="'+static_data.value+'" readonly class="form-control val_date" placeholder = "'+static_data.tip+'">');
		date_in.datetimepicker({
			format : 'yyyy-mm-dd hh:ii',
			autoclose : true
		});
		return date_in;
	},get_:function(par_div) {
		var date_val = par_div.find('> .val_date').val();
		var result = {};
		if(date_val.replace(/(^\s*)/g, "") == '' ){
			result.title = 'error';
			result.msg = '请输入非空字符串';
			result.node =par_div.find('> .val_date');
		}else{
			result.title = 'success';
			result.value = date_val
		}
		return result;
	}},
	new_val_typeahead :{new_: function(static_data,tipSource) {
		var data_in = $('<input size="16" type="text" value="'+static_data.value+'" class="form-control sin_type" placeholder = "'+static_data.tip+'">');

		data_in.typeahead({
			source : tipSource, // 绑定数据源
			highlighter : function(item) {
				return item.split("-\$-")[0];
			},
			updater : function(item) {
				return item.split("-\$-")[0];
			},
			afterSelect : function(item) {
			}
		});

		return data_in;
	},get_:function(par_div) {
		var date_val = par_div.find('> .sin_type').val();
		var result = {};
		if(date_val.replace(/(^\s*)/g, "") == '' ){
			result.title = 'error';
			result.msg = '请输入非空值';
			result.node = par_div.find('> .sin_type');
		}else{
			result.title = 'success';
			result.value = date_val
		}
		return result;
	}},
	new_val_input :{new_: function(static_data,tipSource) {
		return $('<input class="form-control val_in" type="text" placeholder = "'
			+ static_data.tip + '" value = "'+static_data.value+'"/>');
	},get_:function(par_div) {
		var date_val = par_div.find('> .val_in').val();
		var result = {};
		if(date_val.replace(/(^\s*)/g, "") == '' ){
			result.title = 'error';
			result.msg = '请输入非空值';
			result.node =par_div.find('> .val_date');
		}else{
			result.title = 'success';
			result.value = date_val
		}
		return result;

	}},
	new_val_select :{new_: function(static_data,tipSource) {
		var select = $('<select placeholder = "'
			+ static_data.tip + '">').addClass(
			"form-control selectpicker bs-select-hidden mobile-device val_sel");
		$.each(tipSource, function(i, j) {
			select.append('<option value="' + this.value + '">' + this.text
				+ '</option>');
		});
		select.val(static_data.value);
		return select;
	},get_:function(par_div) {
		var date_val = par_div.find('> .val_sel').val();
		var result = {};
		if(date_val.replace(/(^\s*)/g, "") == '' ){
			result.title = 'error';
			result.msg = '请选择一个有效值';
			result.node =par_div.find('> .val_sel');
		}else{
			result.title = 'success';
			result.value = date_val
		}
		return result;
	}},
	new_val_foreign_select :{new_: function(static_data,tipSource) {
		var select = $('<select  placeholder = "'+static_data.tip+'">')
			.addClass(
			"form-control selectpicker bs-select-hidden mobile-device val_foreign");
		//select.append('<option >请选择</option>');
		$.each(tipSource, function(i, j) {
			var entityName = this.entityName;
			var alias = this.alias;
			var properties = this.properties;
			$.each(alias, function(n, m) {
				var group = $('<optgroup>').attr('label',
					entityName + "." + alias[n]);
				$.each(properties, function(o, p) {
					group.append('<option value="' + entityName + "."
						+ alias[n] + "." + this.name + "." + this.type
						+ '">' + this.name + '</option>');
				});
				select.append(group);
			});
		});
		select.val(static_data.value);
		return select;
	},get_:function(par_div) {
		var temp_val = par_div.find('> .val_foreign').val().split('.')

		var result = {};
		if(temp_val.length != 4){
			result.title = 'error';
			result.msg = '请输入非空值';
			result.node =par_div.find('> .val_foreign');
		}else{
			var data_val = {'entity':temp_val[0],'alia':temp_val[1],'property':temp_val[2]};
			result.title = 'success';
			result.value = data_val
		}
		return result;
	}}
};