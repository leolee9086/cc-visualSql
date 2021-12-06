/**
 * 这是初始化的元数据
 * @type {*[]}
 */
var sourceData1 = [
    {
        "entityName": "Note",
        "properties": [
            {
                "name": "id",
                "type": "string"
            },
            {
                "name": "hash",
                "type": "string"
            },
            {
                "name": "box",
                "type": "string"
            },
            {
                "name": "path",
                "type": "string"
            },
            {
                "name": "name",
                "type": "string"
            },
            {
                "name": "alias",
                "type": "string"
            },
            {
                "name": "alias",
                "type": "string"
            },
            {
                "name": "memo",
                "type": "string"
            },
            {
                "name": "content",
                "type": "string"
            },
            {
                "name": "markdown",
                "type": "string"
            },
            {
                "name": "length",
                "type": "string"
            },
            {
                "name": "type",
                "type": "string"
            },
            {
                "name": "subtype",
                "type": "string"
            },
            {
                "name": "ial",
                "type": "string"
            },
            {
                "name": "sort",
                "type": "string"
            },
            {
                "name": "created",
                "type": "string"
            },
            {
                "name": "updated",
                "type": "string"
            }
        ],
        "alias": [
            "blocks"
        ]
    },
];

/**
 * 保存的查询SQL的结构
 * @type {{rules: *[], rulesGroup: *[]}}
 */
var saveJson1 = {
    "oprator": "or",
    "rules": [
        {
            "entity": "Note",
            "alia": "blocks",
            "property": "id",
            "type": "string",
            "consy": "=",
            "value": "372930"
        },
    ]
};

/**
 *key 和 连接符的映射关系
 * @type {*[]}
 */
var propertiesTypes1 = [
    {
        "byte": [
            {
                "value": "=",
                "text": "等于",
                "inputType": "new_val_input",
                "tip": "请输入一个字节",
                "callBack": false
            },
            {
                "value": ">=",
                "text": "大于等于",
                "inputType": "new_val_input",
                "tip": "请输入一个字节",
                "callBack": false
            },
            {
                "value": "<=",
                "text": "小于等于",
                "inputType": "new_val_input",
                "tip": "请输入一个字节",
                "callBack": false
            },
            {
                "value": "!=",
                "text": "不等于",
                "inputType": "new_val_input",
                "tip": "请输入一个字节",
                "callBack": false
            }
        ]
    },
    {
        "short": [
            {
                "value": "=",
                "text": "等于",
                "inputType": "new_val_input",
                "tip": "请输入一个short数据",
                "callBack": false
            },
            {
                "value": ">=",
                "text": "大于等于",
                "inputType": "new_val_input",
                "tip": "请输入一个short数据",
                "callBack": false
            },
            {
                "value": "<=",
                "text": "小于等于",
                "inputType": "new_val_input",
                "tip": "请输入一个short数据",
                "callBack": false
            },
            {
                "value": "!=",
                "text": "不等于",
                "inputType": "new_val_input",
                "tip": "请输入一个short数据",
                "callBack": false
            }
        ]
    },
    {
        "int": [
            {
                "value": "=",
                "text": "等于",
                "inputType": "new_val_input",
                "tip": "请输入一个整数",
                "callBack": false
            },
            {
                "value": ">=",
                "text": "大于等于",
                "inputType": "new_val_input",
                "tip": "请输入一个整数",
                "callBack": false
            },
            {
                "value": "<=",
                "text": "小于等于",
                "inputType": "new_val_input",
                "tip": "请输入一个整数",
                "callBack": false
            },
            {
                "value": "!=",
                "text": "不等于",
                "inputType": "new_val_input",
                "tip": "请输入一个整数",
                "callBack": false
            }
        ]
    },
    {
        "float": [
            {
                "value": "=",
                "text": "等于",
                "inputType": "new_val_input",
                "tip": "请输入一个小数",
                "callBack": false
            },
            {
                "value": ">=",
                "text": "大于等于",
                "inputType": "new_val_input",
                "tip": "请输入一个小数",
                "callBack": false
            },
            {
                "value": "<=",
                "text": "小于等于",
                "inputType": "new_val_input",
                "tip": "请输入一个小数",
                "callBack": false
            },
            {
                "value": "!=",
                "text": "不等于",
                "inputType": "new_val_input",
                "tip": "请输入一个小数",
                "callBack": false
            }
        ]
    },
    {
        "double": [
            {
                "value": "=",
                "text": "等于",
                "inputType": "new_val_input",
                "tip": "请输入一个小数",
                "callBack": false
            },
            {
                "value": ">=",
                "text": "大于等于",
                "inputType": "new_val_input",
                "tip": "请输入一个小数",
                "callBack": false
            },
            {
                "value": "<=",
                "text": "小于等于",
                "inputType": "new_val_input",
                "tip": "请输入一个小数",
                "callBack": false
            },
            {
                "value": "!=",
                "text": "不等于",
                "inputType": "new_val_input",
                "tip": "请输入一个小数",
                "callBack": false
            }
        ]
    },
    {
        "date": [
            {
                "value": "=",
                "text": "等于",
                "inputType": "new_val_input",
                "tip": "请选择日期",
                "callBack": false
            },
            {
                "value": "!=",
                "text": "不等于",
                "inputType": "new_val_input",
                "tip": "请选择日期",
                "callBack": false
            },
            {
                "value": ">=",
                "text": "大于等于",
                "inputType": "new_val_input",
                "tip": "请选择日期",
                "callBack": false
            },
            {
                "value": "<=",
                "text": "小于等于",
                "inputType": "new_date_in",
                "tip": "请选择日期",
                "callBack": false
            }
        ]
    },
    {
        "timestamp": [
            {
                "value": "=",
                "text": "等于",
                "inputType": "new_date_in",
                "tip": "请选择日期",
                "callBack": false
            },
            {
                "value": "!=",
                "text": "不等于",
                "inputType": "new_date_in",
                "tip": "请选择日期",
                "callBack": false
            },
            {
                "value": ">=",
                "text": "大于等于",
                "inputType": "new_date_in",
                "tip": "请选择日期",
                "callBack": false
            },
            {
                "value": "<=",
                "text": "小于等于",
                "inputType": "new_date_in",
                "tip": "请选择日期",
                "callBack": false
            }
        ]
    },
    {
        "string": [
            {
                "value": "like",
                "text": "类似",
                "inputType": "new_val_typeahead",
                "tip": "请输入一个字符串",
                "callBack": true
            },
            {
                "value": "=",
                "text": "等于",
                "inputType": "new_val_typeahead",
                "tip": "请输入一个字符串",
                "callBack": true
            },
            {
                "value": "!=",
                "text": "不等于",
                "inputType": "new_val_typeahead",
                "tip": "请输入一个字符串",
                "callBack": true
            },
            {
                "value": "in",
                "text": "包含",
                "inputType": "new_val_typeahead",
                "tip": "请输入多个字符串，以英文逗号分割",
                "callBack": true
            },
            {
                "value": "not in",
                "text": "不包含",
                "inputType": "new_val_typeahead",
                "tip": "请输入多个字符串，以英文逗号分割",
                "callBack": true
            },
            {
                "value": " is null",
                "text": "为空",
                "inputType": "null",
                "callBack": true
            },
            {
                "value": "is not null",
                "text": "不为空",
                "inputType": "null",
                "callBack": true
            }
        ]
    },
    {
        "foreign": [
            {
                "source": true,
                "value": "=",
                "text": "等于",
                "tip": "请选择关联属性",
                "inputType": "new_val_foreign_select",
                "callBack": false
            }
        ]
    }
];