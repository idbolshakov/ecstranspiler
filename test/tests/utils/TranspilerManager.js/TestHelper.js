const TEST_ROOT_DIR  = '../../../';
const BaseTestHelper = require(`${TEST_ROOT_DIR}utils/TestHelper`);

class TestHelper extends BaseTestHelper {

  static getTranspilerMethod() {
    const
      Transpiler     = class {
        constructor() {
          this.hash = new Date().getTime();
        }
      },
      transpilerName = 'es6_class',
      path           = `./lang/${transpilerName}/Transpiler`;


    return {
      fakeRequire: (path) => {

        return Transpiler;
      },
      Transpiler: Transpiler,
      transpilerName: transpilerName,
      path: path
    }
  }
}
TestHelper.ROOT_DIR = `${TEST_ROOT_DIR}../`;

module.exports = TestHelper;
