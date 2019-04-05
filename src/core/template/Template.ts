/**
 * @file template
 * @author Yuyi Liang <liang.pearce@gmail.com>
 */

import { compile } from 'yuefu-template-compiler';
import { Player } from '../player';
import { ASTCompiler, IModel, ITemplateDescriptor } from './ASTCompiler';
import { insertCss } from './utils';

export interface ITemplateOptions {
    [key: string]: any;
}

export interface ITemplateComponent {
    template: string;
    model: IModel;
    style: string;
}

class Template {
    public player: Player;
    public options: ITemplateOptions;
    public template: string;
    public model: IModel;
    public style: string;
    public element: string;
  constructor (element: string, component: ITemplateComponent, player: Player, model: IModel, options: ITemplateOptions) {
    this.player = player;
    this.options = options;
    this.template = component.template;
    this.model = component.model;
    this.style = component.style;
    this.element = element;
  }
  public render (): any {
    console.log('[template]render:');
    if (!this.template) {
      throw new Error('未设置template');
    }
    const templateDescriptor: ITemplateDescriptor = compile(this.template, this.options);

    console.log('[template]compiled:', templateDescriptor);

    // TODO: 对DOM的操作更加面向对象，比如这个new是有副作用的
    // tslint:disable-next-line:typedef
    const astCompiler = new ASTCompiler(this.element, templateDescriptor, this.model, {
      inject: {
        $player: this.player, // 注入$player对象
      },
    });
    console.log('[template]css injected:', {
        $player: this.player, // 注入$player对象
    });
    // const mvvm = new MVVM({
    //   el: this.element,
    //   data: this.model.data,
    //   mounted: this.model.mounted,
    //   methods: this.model.methods,
    //   templateDescriptor: compiled
    // })

    // 插入template的css
    // TODO: 考虑会影响其他样式，考虑加入scoped
    const style: any = insertCss(this.style);

    return {
        templateDescriptor,
        style,
    };
  }
}
export {
    Template
};
