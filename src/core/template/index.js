import { compile } from "yuefu-template-compiler";
import MVVM from "./mvvm";

class Template {
  constructor(template, options) {
    this.template = template;
    this.options = options;
  }
  render() {
    if(!this.template) {
      throw new Error("未设置template");
    }
    const compiled = compile(this.template, this.options);
    const mvvm = new MVVM({
      data: {
        playingClass: "playing",
        playState: "playing",
      },
      methods: {
        sayHi: function() {
          this.word = "Hi, everybody!";
        },
        togglePlayState: function() {
          console.log("click test");
        }
      },
      templateDescriptor: compiled.render
    });
  }
}
Template.DEFAULTS = {};
// Module.name = 'undefinedModule'

export default Template;
