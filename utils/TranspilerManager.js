/**
 * класс отвечает за управление
 * доступными транспилерами
 *
 * @author idbolshakov@gmail.com
 */
class TranspilerManager {

  /**
   * конструктор
   *
   * @public
   * @param {string} transpilerName - название транспилера
   * @param {object} requireObject  - объект для подключения зависимостей
   * @param {object} fileSystem     - объект для работы с файловой системой
   */
  constructor(transpilerName, requireObject) {

    this._transpilerName = transpilerName;
    this._requireObject  = requireObject;
  }

  /**
   * возвращает экземпляр нужного транспилера
   *
   * @public
   * @param {object} ast - AST ECS
   */
  getTranspiler(ast) {
    let Transpiler = this._requireObject(this._getPath());

    return new Transpiler(ast);
  }

  /**
   * Возвращает путь по которому будет искаться модуль транспилера
   *
   * @private
   * @return {string} -  путь по которому будет искаться модуль транспилера
   */
  _getPath() {

    return `./lang/${this._transpilerName}/Transpiler`;
  }
}

module.exports = TranspilerManager;
