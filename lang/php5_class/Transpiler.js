/**
 * Класс отвечает за транспайлинг 
 * из ECS в PHP5 класс
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
  }

  /**
   * Перевод AST ECS в код 
   *
   * @public
   * @return {string} - сгенерированный код в формате PHP5 класса
   */
  transpile() {
    let out = '';

    // блок комментариев к классу
    out += this._getDocumentComment(this._inputAST.comment);

    // заголовок класса
    out += `class ${this._inputAST.name} {\n`

    // методы и свойства класса
    for (let i=0, l=this._inputAST.data.length; i<l; i++) {
      let 
        data = this._inputAST.data[i],
        comment = this._getDocumentComment(data.comment, '  ');

      // комменатрий свойства или метода
      comment && (out += comment);

      switch(data.type) {

        case 'property': 
          out += `  ${data.scope}${data.is_static ? ' static' : ''} $${data.name};\n\n`;
          break;

        case 'method':
          let methodArgs = this._getArguments(data.arguments);
          out += `  ${data.scope}${data.is_static ? ' static' : ''} function ${data.name}(${methodArgs}) {};\n\n`;
          break;
      }
    } 
    
    out += `}\n`;

    return out;
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
      return `$${current.name}`;
    }).join(', ');
  }
}

module.exports = Transpiler;
