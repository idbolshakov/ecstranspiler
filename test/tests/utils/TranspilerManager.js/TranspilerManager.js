let assert = require('assert');
let sinon  = require('sinon');
let Helper = require('./TestHelper');

let TranspilerManager = require(`${Helper.ROOT_DIR}utils/TranspilerManager`);


describe('utils/TranspilerManager класc', () => {

  describe('Конструктор', () => {
   
    Helper.assertIsClassInstance('Должен создать новый экземпляр класа TranspilerManager', TranspilerManager);
  });

  describe('Публичные методы', () => {
   
    Helper.assertPublicMethod('Должен содержать публичный метод getTranspiler()', TranspilerManager, 'getTranspiler');
  });

  describe('метод getTranspiler', () => {

    it('Должен вызывать requireObject с аргументом "./lang/{transpilerName}/Transpiler"', () => {
      let 
        helper         = Helper.getTranspilerMethod(),
        spy            = sinon.spy(helper.fakeRequire);

      let transpilerManager = new TranspilerManager(helper.transpilerName, spy);
      transpilerManager.getTranspiler(helper.transpilerName);

      assert(spy.calledWith(helper.path));
    });

    it('Должен возвращает экземпляр транспиллера', () => {
      let 
        helper         = Helper.getTranspilerMethod(),
        spy            = sinon.spy(helper.fakeRequire);

      let transpilerManager = new TranspilerManager(helper.transpilerName, spy);
      let transpiler = transpilerManager.getTranspiler(helper.transpilerName);

      assert(transpiler instanceof helper.Transpiler);

    });
  });
});
