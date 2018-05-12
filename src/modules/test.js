import Module from '../core/module'
class TestModule extends Module {
  constructor(player, options) {
    super(player, options)
    console.log('this is module test');
  }
}

export default TestModule
