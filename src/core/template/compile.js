import Watcher from "./watcher";

function Compile(el, templateDescriptor, vm) {
  this.$vm = vm;
  this.$el = document.querySelector(el)
  if (this.$el) {
    this.$fragment = this.node2Fragment();
    this.init(templateDescriptor);
    this.$el.appendChild(this.$fragment);
  }
}

function createElement(tag, data, childrens = []) {
  const dom = document.createElement(tag);
  if(data && data.on && data.on.click) {
    dom.addEventListener("click", data.on.click.bind(this));
  }

  debugger
  const attrs = (data && data.attrs) ? data.attrs : {}
  Object.keys(attrs).forEach((attr) => {
    dom.setAttribute(attr, data.attrs[attr])
  })

  if(data && (data.class || data.staticClass)) {
    dom.setAttribute('class', (data.class ? data.class : ' ') + (data.staticClass ? data.staticClass : ''))
  }

  childrens && childrens.forEach((child) => {
    dom.appendChild(child);
  });
  return dom;
}

Compile.prototype = {
  node2Fragment: function() {
    var fragment = document.createDocumentFragment();
    // let child = el.firstChild;

    // // 将原生节点拷贝到fragment
    // while (child) {
    //   fragment.appendChild(child);
    //   child = el.firstChild;
    // }

    return fragment;
  },

  init: function(templateDescriptor) {
    this.$vm.ast = templateDescriptor.ast;
    this.$vm.render = new Function(templateDescriptor.render);
    this.$vm._c = createElement;
    // this.$vm._v = document.createTextNode;
    this.$vm._v = document.createTextNode.bind(document);
    this.$vm._s = (str) => {
      return `${str.toString()}`;
    };
    let res = this.$vm.render();
    this.$fragment.appendChild(res);
    this.compileElement(this.$fragment, [this.$vm.ast]);
  },

  compileElement: function(el, ast) {
    var childNodes = el.childNodes;
    [].slice.call(childNodes).forEach((node, index) => {
      if (this.isElementNode(node) || this.isTextNode(node)) {
        this.compile(node, ast[index]);
      }

      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node, ast[index].children);
      }
    });
  },

  compile: function(node, ast) {
    debugger
    var attrs = ast.attrsMap || {};
    Object.keys(attrs).forEach((attr) => {

    })
    if(ast.classBinding) {
      compileUtil.bind(this.$vm, ast.classBinding)
    }

    // v-if
    if(ast.ifConditions) {

    }

    // text binding
    if(ast.type === 2) {
      ast.tokens.forEach((token) => {
        if(token['@binding']) {
          compileUtil.bind(this.$vm, token['@binding'])
        }
      })
    }
    // classBinding

      // attrsBinding

      // eventBinding
  },

  compileText: function(node, exp) {
    compileUtil.text(node, this.$vm, exp);
  },

  isDirective: function(attr) {
    return attr.indexOf("v-") == 0;
  },

  isEventDirective: function(dir) {
    return dir.indexOf("on") === 0;
  },

  isElementNode: function(node) {
    return node.nodeType == 1;
  },

  isTextNode: function(node) {
    return node.nodeType == 3;
  }
};

// 防止重复binding
var bindingCached = {}

// 指令处理集合
var compileUtil = {
  text: function(node, vm, exp) {
    this.bind(node, vm, exp, "text");
  },

  html: function(node, vm, exp) {
    this.bind(node, vm, exp, "html");
  },

  model: function(node, vm, exp) {
    this.bind(node, vm, exp, "model");

    var me = this,
      val = this._getVMVal(vm, exp);
    node.addEventListener("input", function(e) {
      var newValue = e.target.value;
      if (val === newValue) {
        return;
      }

      me._setVMVal(vm, exp, newValue);
      val = newValue;
    });
  },

  class: function(node, vm, exp) {
    this.bind(node, vm, exp, "class");
  },

  // TODO: 局部更新？
  bind: function(vm, exp) {
    if(bindingCached[exp]) {
      return
    }
    var updaterFn = () => {
      const wrapperDOM = document.querySelector(vm.$options.el)
      wrapperDOM.replaceChild(vm.render(), wrapperDOM.childNodes[0])
    }
    new Watcher(vm, exp, function(value, oldValue) {
      updaterFn && updaterFn();
    });
    bindingCached[exp] = true;
  },

  // 事件处理
  eventHandler: function(node, vm, exp, dir) {
    var eventType = dir.split(":")[1],
      fn = vm.$options.methods && vm.$options.methods[exp];

    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm), false);
    }
  },

  _getVMVal: function(vm, exp) {
    var val = vm;
    exp = exp.split(".");
    exp.forEach(function(k) {
      val = val[k];
    });
    return val;
  },

  _setVMVal: function(vm, exp, value) {
    var val = vm;
    exp = exp.split(".");
    exp.forEach(function(k, i) {
      // 非最后一个key，更新val的值
      if (i < exp.length - 1) {
        val = val[k];
      } else {
        val[k] = value;
      }
    });
  }
};


var updater = {
  textUpdater: function(node, value) {
    node.textContent = typeof value == "undefined" ? "" : value;
  },

  htmlUpdater: function(node, value) {
    node.innerHTML = typeof value == "undefined" ? "" : value;
  },

  classUpdater: function(node, value, oldValue) {
    var className = node.className;
    className = className.replace(oldValue, "").replace(/\s$/, "");

    var space = className && String(value) ? " " : "";

    node.className = className + space + value;
  },

  modelUpdater: function(node, value, oldValue) {
    node.value = typeof value == "undefined" ? "" : value;
  }
};

export default Compile;
