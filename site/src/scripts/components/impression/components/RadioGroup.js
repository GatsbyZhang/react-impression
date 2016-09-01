import classnames from 'classnames';
import React, { PureComponent, PropTypes } from 'react';

/**
 * RadioGroup组件.
 */
export default class RadioGroup extends PureComponent {
    //初始化state
    constructor(props, context){
        super(props, context);

        //是否木偶组件
        this.isPuppet = props.value !== undefined? true : false;

        this.state = {
            value: this.isPuppet? undefined : props.defaultValue,
        };
    }
    //props校验
    static propTypes = {
        //自定义样式
        className: PropTypes.string,
        //值
        value: PropTypes.any,
        //默认是否选中
        defaultValue: PropTypes.any,
        //回调函数
        onChange: PropTypes.func,
        //是否disabled
        disabled: PropTypes.bool,
        //名称
        name: PropTypes.string,
        //排列方向
        direction: PropTypes.oneOf(['row', 'column'])
    }
    //默认props
    static defaultProps = {
        disabled: false,
        direction: 'row'
    }
    //radio切换回调函数
    onChangeHandle = (event, value) => {
        let { onChange } = this.props;

        if(this.isPuppet){
            onChange && onChange(value, event);
        } else {
            this.setState({
                value
            }, () => {
                onChange && onChange(value, event);
            });
        }
    }
    //渲染
    render(){
        let { className, name, direction, onChange, children, ...others } = this.props,
            originValue = this.isPuppet? this.props.value : this.state.value;

        children = React.Children.map(children, (child, index) => {
            let { value, disabled } = child.props,
                options = {
                    name: name || `radio_${this._reactInternalInstance._mountOrder}`,
                    key: index,
                    onChange:  this.onChangeHandle,
                    disabled: disabled || this.props.disabled
                };

            //是否选中
            if((value !== undefined) || originValue !== undefined){
                options.checked = (originValue === value);
            }

            return React.cloneElement(child, options);
        });

        return(
            <div {...others} className={classnames(direction==='row'?'radio-inline': 'radio-vertical', className)}>
                {children}
            </div>
        );
    }
}

//获取选中值
RadioGroup.getValue = ref => {
    return ref? (ref.isPuppet? ref.props.value : ref.state.value) : undefined;
}
