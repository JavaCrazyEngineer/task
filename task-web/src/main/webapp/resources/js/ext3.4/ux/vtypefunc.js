Ext.apply(Ext.form.VTypes,{
    password:function(val,field){//val指这里的文本框值，field指这个文本框组件
       if(field.confirmTo){//confirmTo自定义的配置参数，一般用来保存另外的组件的id值
           var pwd = Ext.get(field.confirmTo);//取得confirmTo的那个id的值
           return (val==pwd.getValue());
       }
       return true;
    },
    daterange : function(val, field) {
        var date = field.parseDate(val);

        if(!date){
            return false;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = Ext.getCmp(field.startDateField);
            start.setMaxValue(date);
            start.validate();
            this.dateRangeMax = date;
        }
        else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = Ext.getCmp(field.endDateField);
            end.setMinValue(date);
            end.validate();
            this.dateRangeMin = date;
        }
        /*
         * Always return true since we're only using this vtype to set the
         * min/max allowed values (these are tested for after the vtype test)
         */
        return true;
    }
});

