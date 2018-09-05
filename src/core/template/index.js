import { compile } from "yuefu-template-compiler";
import MVVM from "./mvvm";
import insertCss from "../../utils/insert-css";

class Template {
  constructor(element, template, model, options) {
    this.template = template;
    this.options = options;
    this.model = model;
    this.element = element;
  }
  render() {
    if(!this.template) {
      throw new Error("未设置template");
    }
    const compiled = compile(this.template.template, this.options);
    const mvvm = new MVVM({
      el: this.element,
      data: this.model.data,
      methods: this.model.methods,
      templateDescriptor: compiled
    });

    const style = insertCss(this.template.style);
    debugger;
  }
}
Template.DEFAULTS = {};
// Module.name = 'undefinedModule'

export default Template;
