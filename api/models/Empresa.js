/**
 * Empresa.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    nombrecorto:{
      type: 'string'
    },
    empresa: {
      type: 'string'
    },
    slug: {
      type: 'string'
    },
    plan: {
      model: 'plan'
    },
    url: {
      type: 'string'
    },
    descripcion: {
      type: 'string'
    },
    direccion: {
      type: 'string'
    },
    celular: {
      type: 'string'
    }
  }
};
