/**
 * Класс отвечает за транспайлинг 
 * из ECS в Javascript ES6 класс
 *
 * @author idbolshakov@gmail.com
 */
class Transpiler {

  /**
   * конструктор 
   *
   * @public
   * @param {object} inputAST - AST ECS
   */
  constructor(inputAST) {

    this._inputAST  = inputAST;
    this._customAST = null;
  }

  /**
   * Перевод AST ECS в код 
   *
   * @public
   * @return {string} - сгенерированный код в формате JS ES6 класса
   */
  transpile() {
    let out = '';

    this._generateCustomAST();

    out += this._getDocumentComment(this._inputAST.comment);

    // конструктор и свойства
    out += `class ${this._inputAST.name} {\n`
      +`  constructor(${this._getArguments(this._customAST.constructor.arguments)}) {\n`;

    for (let i=0, l=this._customAST.properties.length; i<l; i++) {

      out += `    this._${this._customAST.properties[i].name} = null;\n`;
    }
    out += `  }\n\n`;

    // методы
    for (let i=0, l=this._customAST.methods.length; i<l; i++) {
      let 
        data = this._customAST.methods[i],
        comment = this._getDocumentComment(data.comment, '  ');

      // комменатрий свойства или метода
      comment && (out += comment);

      out += `  ${data.name}(${this._getArguments(data.arguments)}) {}\n\n`;
    }
    out += `}\n`;

    return out;
  }

  /**
   * Обходит AST ECS формирует нужную структуру данных
   * (ищем в AST свойства, методы и конструктор)
   * нужная структура записывается в this._customAST
   *
   * @private
   */
  _generateCustomAST() {
    this._customAST = { 
      properties: [],
      methods: [],
      constructor: {arguments: []}
    };

    for (let i=0, l=this._inputAST.data.length; i<l; i++) {
      
      switch (this._inputAST.data[i].type) {

        case 'property':
          this._customAST.properties.push(this._inputAST.data[i]);
          break;

        case 'method':
          this._inputAST.data[i].name === 'constructor' 
            ? this._customAST.constructor = this._inputAST.data[i]
            : this._customAST.methods.push(this._inputAST.data[i]);
          break;
      }
    }
  }

  /**
   * возвращает блок документирующего комментария по входному AST ECS этого комментария
   *
   * @return {string} блок документирующего комментария
   * @param {object} astComment - документирующий комментарий в формате AST ECS
   * @param {string} customOffset - отступ блока комментариев
   */
  _getDocumentComment(astComment, customOffset) {
    let 
      out = '',
      offset = customOffset || '';

    if (!astComment) return;

    out = `${offset}/**\n`;

    for(let i=0, l=astComment.length; i<l; i++) {
      let 
        plain = astComment[i]['plain_text'],
        tag   = astComment[i]['block_tag'];
      
      plain !== undefined && (out += `${offset} * ${plain}\n`);
      tag !== undefined && (out += `${offset} * @${tag['tag']} ${tag['tag_content']}\n`);
    }

    out += `${offset} */\n`;

    return out;
  }

  /**
   * Возвращает список аргументов метода через запятую
   *
   * @private
   * @param {array} methodArguments - список аргументов метода в формате AST ECS
   * @return {string} список аргументов метода через запятую
   */
  _getArguments(methodArguments) {

    return methodArguments.map((current) => {
      return current.name;
    }).join(', ');
  }
}

module.exports = Transpiler;
