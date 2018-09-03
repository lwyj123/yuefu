import Watcher from "./watcher";

function Compile(templateDescriptor, vm) {
  this.$vm = vm;
  this.$el = document.createElement("div");

  if (this.$el) {
    this.$fragment = this.node2Fragment();
    this.init(templateDescriptor);
    this.$el.appendChild(this.$fragment);
    document.body.appendChild(this.$el);
  }
}

function createElement(tag, data, childrens = [], type) {
  const dom = document.createElement(tag);
  debugger;
  // attr
  if(data && data.attrs) {
    Object.keys(data && data.attrs || {}).forEach((attr) => {
      compileUtil.eventHandler(dom, this, attr);
    });
  }

  // event
  if(data && data.on && data.on.click) {
    dom.addEventListener("click", data.on.click);
  }

  childrens && childrens.forEach((child) => {
    dom.appendChild(child);
  });
  debugger;
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
    this.$vm.render = new Function(templateDescriptor);
    this.$vm._c = createElement;
    // this.$vm._v = document.createTextNode;
    this.$vm._v = document.createTextNode.bind(document);
    this.$vm._s = (str) => {
      return str.toString();
    };
    let res = this.$vm.render();
    this.$fragment.appendChild(res);
    debugger;
    this.compileElement(this.$fragment);

  },

  compileElement: function(el) {
    var childNodes = el.childNodes,
      me = this;

    [].slice.call(childNodes).forEach(function(node) {
      var text = node.textContent;
      var reg = /\{\{(.*)\}\}/;

      if (me.isElementNode(node)) {
        me.compile(node);

      } else if (me.isTextNode(node) && reg.test(text)) {
        me.compileText(node, RegExp.$1);
      }

      if (node.childNodes && node.childNodes.length) {
        me.compileElement(node);
      }
    });
  },

  compile: function(node) {
    var nodeAttrs = node.attributes,
      me = this;

    [].slice.call(nodeAttrs).forEach(function(attr) {
      var attrName = attr.name;
      if (me.isDirective(attrName)) {
        var exp = attr.value;
        var dir = attrName.substring(2);
        // 事件指令
        if (me.isEventDirective(dir)) {
          compileUtil.eventHandler(node, me.$vm, exp, dir);
          // 普通指令
        } else {
          compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
        }

        node.removeAttribute(attrName);
      }
    });
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

  bind: function(node, vm, exp, dir) {
    var updaterFn = updater[dir + "Updater"];

    updaterFn && updaterFn(node, this._getVMVal(vm, exp));

    new Watcher(vm, exp, function(value, oldValue) {
      updaterFn && updaterFn(node, value, oldValue);
    });
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
