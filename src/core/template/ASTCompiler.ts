/**
 * @file compile
 * @author Yuyi Liang <liang.pearce@gmail.com>
 */

function createElement (tag: keyof HTMLElementTagNameMap, data: any, childrens: any[] = []): HTMLElement {
    const dom: HTMLElement = document.createElement(tag);

    const attrs: any = (data && data.attrs) ? data.attrs : {};
    Object.keys(attrs).forEach((attr: any) => {
      dom.setAttribute(attr, data.attrs[attr]);
    });

    if (data && (data.class || data.staticClass)) {
      dom.setAttribute('class', `${data.class ? data.class : ' '}' '${data.staticClass ? data.staticClass : ' '}`.trim());
    }

    if (childrens.length !== 0) {
        childrens.forEach((child: any) => {
            dom.appendChild(child);
        });
    }

    return dom;
  }

function isDirective (attr: any): boolean {
    return attr.indexOf('v-') === 0;
  }

function isEventDirective (dir: any): boolean {
    return dir.indexOf('on') === 0;
  }

function isElementNode (node: Node): boolean {
    return node.nodeType === 1;
}

function isTextNode (node: Node): boolean {
    return node.nodeType === 3;
}

export interface IModel {
    style: string;
    methods: any;
    data: any;
    mounted(): void;
}

export interface IViewModel {
    data: any;
    methods: any;
    [key: string]: any;
}

export interface ICompileOptions {
    inject: any;
}

export interface ITemplateDescriptor {
    ast: any;
    render: any;
}

class ASTCompiler {
    public model: IModel;
    public $vm: IViewModel;
    public $el: HTMLElement;
    public $fragment: DocumentFragment;
    constructor(elQuery: string, templateDescriptor: ITemplateDescriptor, model: IModel, options: ICompileOptions) {
        this.model = model;
        this.$vm = {...model.data, ...model.methods, ...options.inject};
        this.$el = document.querySelector(elQuery);
        if (this.$el) {
          this.$fragment = this.node2Fragment();
          this.init(templateDescriptor);
          this.$el.appendChild(this.$fragment);
        }
    }
    public node2Fragment(): DocumentFragment {
        return document.createDocumentFragment();
    }
    public init(templateDescriptor: ITemplateDescriptor): void {
        this.$vm.ast = templateDescriptor.ast;
        // tslint:disable-next-line:no-function-constructor-with-string-args
        this.$vm.render = new Function(templateDescriptor.render);
        this.$vm._c = createElement;
        this.$vm._e = document.createComment.bind(document, '');
        this.$vm._v = document.createTextNode.bind(document);
        this.$vm._s = (str: any): string => {
          return `${str.toString()}`;
        };
        const res: HTMLElement = this.$vm.render();
        this.$fragment.appendChild(res);
        this.compileElement(this.$fragment, [this.$vm.ast]);
        this.model.mounted.call(this.$vm);
    }
    public compileElement(el: HTMLElement | DocumentFragment, ast: any): void {
        const childNodes: NodeListOf<Node & ChildNode> = el.childNodes;
        [].slice.call(childNodes).forEach((node: HTMLElement, index: number) => {
          if (isElementNode(node) || isTextNode(node)) {
            this.compile(node, ast[index]);
          }

          if (node.childNodes && node.childNodes.length) {
            this.compileElement(node, ast[index].children);
          }
        });
    }
    public compile(node: Node, ast: any): void {
        if (ast.events) {
            Object.keys(ast.events).forEach((event: string) => {
              if (event === 'click') {
                const exp: string = ast.events[event].value;
                const fn: any = this.$vm[exp];
                node.addEventListener('click', fn.bind(this.$vm), false);
              }
              if (event === 'mousedown') {
                const exp: string = ast.events[event].value;
                const fn: any = this.$vm[exp];
                node.addEventListener('mousedown', fn.bind(this.$vm), false);
              }
            });
          }
    }
}

export {
    ASTCompiler
};
