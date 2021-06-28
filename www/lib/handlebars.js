const timeago = require('timeago.js');
const timeagoInstance = timeago;

const helpers = {};

var locale = function(number, index, totalSec) {
    // number: the time ago / time in number;
    // index: the index of array below;
    // totalSec: total seconds between date to be formatted and today's date;
    return [
      ['justo ahora', 'ahora'],
      ['%s segundos atrás', 'en %s segundos'],
      ['1 minuto atrás', 'en 1 minuto'],
      ['%s minutos atrás', 'en %s minutos'],
      ['1 hora atrás', 'en 1 hora'],
      ['%s horas atrás', 'en %s horas'],
      ['1 día atrás', 'en 1 día'],
      ['%s días atrás', 'en %s días'],
      ['1 semana atrás', 'en 1 semana'],
      ['%s semanas atrás', 'en %s semanas'],
      ['1 mes atrás', 'en 1 mes'],
      ['%s meses atrás', 'en %s meses'],
      ['1 año atrás', 'en 1 año'],
      ['%s años atrás', 'en %s años']
    ][index];
  };
  timeago.register('es_ES', locale);

helpers.timeago = (timestamp) =>{
    return timeagoInstance.format(timestamp, 'es_ES');
};

module.exports = helpers;