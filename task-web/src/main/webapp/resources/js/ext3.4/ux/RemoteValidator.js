// vim: ts=4:sw=4:nu:fdc=4:nospell
/**
 * Ext.ux.plugins
 *
 * @author    Ing. Jozef Sakáloš <jsakalos@aariadne.com>
 * @copyright (c) 2007, by Ing. Jozef Sakáloš
 * @date      24. November 2007
 * @version   $Id: Ext.ux.plugins.js 596 2007-11-25 13:40:43Z jozo $
 */
 
Ext.namespace('Ext.ux', 'Ext.ux.plugins');
 
/**
 * Remote Validator
 * Makes remote (server) field validation easier
 *
 * To be used by form fields like TextField, NubmerField, TextArea, ...
 */
Ext.ux.plugins.RemoteValidator = {
    init:function(field) {
        // save original functions
        var isValid = field.isValid;
        var validate = field.validate;
 
        // apply remote validation to field
        Ext.apply(field, {
             remoteValid:false
 
            // private
            ,isValid:function(preventMark) {
                if(this.disabled) {
                    return true;
                }
                return isValid.call(this, preventMark) && this.remoteValid;
            }
 
            // private
            ,validate:function() {
                var clientValid = validate.call(this);
                if(!this.disabled && !clientValid) {
                    return false;
                }
                if(this.disabled || (clientValid && this.remoteValid)) {
                    this.clearInvalid();
                    return true;
                }
                if(!this.remoteValid) {
                    this.markInvalid(this.reason);
                    return false;
                }
                return false;
            }
 
            // private - remote validation request
            ,validateRemote:function() {
                this.rvOptions.params = this.rvOptions.params || {};
                this.rvOptions.params.field = this.name;
                try {
                     this.rvOptions.params.validateValue = this.getValue();
                     Ext.Ajax.request(this.rvOptions);
                }
                catch(e) {
                    //如果是失去焦点验证，当表单窗户关闭是触发需要此验证
                    return false;
                }     
            }
 
            // private - remote validation request success handler
            ,rvSuccess:function(response, options) {
                var o;
                try {
                    o = Ext.decode(response.responseText);
                    if(!o.success && o.msg && exceptionHandle){
                       exceptionHandle(o.msg);
                    }
                }
                catch(e) {
                    throw this.cannotDecodeText;
                }
                if('object' !== typeof o) {
                    throw this.notObjectText;
                }
                if(true !== o.success) {
                    throw this.serverErrorText + ': ' + o.error;
                }
                var names = this.rvOptions.paramNames;
                this.remoteValid = true === o[names.valid];
                this.reason = o[names.reason];
                this.validate();
            }
 
            // private - remote validation request failure handler
            ,rvFailure:function(response, options) {
                throw this.requestFailText
            }
 
            // private - runs from keyup event handler
            ,filterRemoteValidation:function(e) {
                if(!e.isNavKeyPress()) {
                    this.remoteValidationTask.delay(this.remoteValidationDelay);
                }
            }
        });
 
        // remote validation defaults
        Ext.applyIf(field, {
             remoteValidationDelay:500
            ,reason:'Server has not yet validated the value'
            ,cannotDecodeText:'Cannot decode json object'
            ,notObjectText:'Server response is not an object'
            ,serverErrorText:'Server error'
            ,requestFailText:'Server request failed'
        });
 
        // install event handlers on field render
        field.on({
            render:{single:true, scope:field, fn:function() {
                this.remoteValidationTask = new Ext.util.DelayedTask(this.validateRemote, this);
                this.el.on(this.validationEvent, this.filterRemoteValidation, this);
            }}
        });
 
        // setup remote validation request options
        field.rvOptions = field.rvOptions || {};
        Ext.applyIf(field.rvOptions, {
             method:'post'
            ,scope:field
            ,success:field.rvSuccess
            ,failure:field.rvFailure
            ,paramNames: {
                 valid:'valid'
                ,reason:'reason'
            }
        });
    }
};
 
// end of file