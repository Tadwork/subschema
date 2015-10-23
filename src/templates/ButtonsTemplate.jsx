var React = require('../react');
var tu = require('../tutils');
var style = require('./ButtonsTemplate-style');
var ButtonsTemplate = React.createClass({
    mixins: [require('../LoaderMixin')],
    getDefaultProps(){
        return {
            buttonsClass: style.buttonsClass,
            buttonClass: style.buttonClass,
            buttonTemplate: 'ButtonTemplate',
            buttons: [{
                action: 'submit',
                label: 'Submit',
                template: 'Button'
            }],
            onClick: function (event, action, btn, value) {

            }
        }
    },

    makeButtons(){
        var onClick = this.props.onClick;
        return this.props.buttons.map((b)=> {
            onClick = b.onClick || onClick;
            var btn = tu.isString(b) ? {
                action: b,
                label: b,
                onClick
            } : tu.extend({}, b, {onClick});
            if (this.props.buttonClass) {
                btn.buttonClass = (btn.buttonClass || '') + ' ' + this.props.buttonClass;
            }
            btn.template = this.props.loader.loadTemplate(b.template || this.props.buttonTemplate);
            return btn;
        })
    },

    render(){
        return <div className={style.formGroup}>
            <div className={this.props.buttonsClass}>
                {this.makeButtons().map((b, i)=> {
                    var Template = b.template;
                    return <Template key={"btn-"+i} {...b} loader={this.props.loader} valueManager={this.props.valueManager}/>
                })}
            </div>
        </div>
    }

})

module.exports = ButtonsTemplate;