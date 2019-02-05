/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Passwords = require('machinepack-passwords');
module.exports = {
    query: function(req, res) {
        User.find(req.body.params)
        .exec(
            function(err, result){
                if (err) {
                    return res.badRequest(err);
                }
                return res.ok({status: 200, data: result});
                });
    },
	register: function(req, res){
        sails.log(req.body);
        Passwords.encryptPassword({
            password: req.body.password,
          }).exec({
            error: function (err){
              return res.serverError(err);
            },
            success: function (encryptedPassword) {
                var data = {
					name: req.body.name,
                    username: req.body.username,
					lastname: req.body.lastname,
                    email: req.body.email,
                    celular: req.body.celular,
					cabeza: req.body.cabeza,
                    password: encryptedPassword
                }
                if (data.cabeza) {
                    User.findOne({username: data.cabeza}).exec({
                        success: function(response){
                            sails.log(response);
                                if(response) {
                                    data.cabeza  =  response.id;
                                    Rol.find({nombre: 'user'}).exec({
                                        success: function(response){
                                         sails.log(response);
                                         data.rol  =  response[0].id;
                                         User.create(data).exec(function(err, result){
                                             if (err){
                                                 return res.badRequest(err);
                                             }
                                             sails.log('User '+ result.id +' has logged in.');
                                             sails.log(result);
                                             result.password = ' ';
                                             Nivel.findOne({title: 'plata'}).exec(
                                                 {
                                                     success: function(response) {
                                                         if(response) {
                                                             sails.log(response);
                                                             Usernivel.create({user: result.id, nivel: response.id}).exec({
                                                                success: function(resUsernivel) {
                                                                    return res.ok({status: 200, data: result});
                                                                },
                                                                error: function(error){
                                                                    sails.log(error);
                                                                    return res.badRequest(error);
                                                                }
                                                             });
                                                         }
                                                     },
                                                     error: function(error){
                                                        sails.log(error);
                                                        return res.badRequest(error);
                                                    }
                                                 }
                                             );
                                             });
                                         },
                                         error: function(error){
                                             sails.log(error);
                                             return res.badRequest(error);
                                         }
                                     });
                                }
                               else {
                                return res.badRequest({status: 404, message: ' EL referido no se encuentra registrado'});
                               }

                        },
                        error: function(error){
                            sails.log(error);
                            return res.badRequest({status: 404, message: ' EL referido no se encuentra registrado', data: error});
                        }
                    });
                } else {
                    return res.badRequest({status: 404, message: 'Ingresa el referido'});
                }
            }
        })

    },
    login: function(req, res){
        User.findOne({username: req.param('username')}).exec(function(err, user){
            if(err) return res.send({'success': false,'message': 'Peticion fallida','data': err});
            if(!user) return res.send({'success': false,'message': 'Usuario no encontrado','data': user});
            Passwords.checkPassword({
                passwordAttempt: req.param('password'),
                encryptedPassword: user.password,
                }).exec({
                error: function (err) {
                    return res.send({'success': false,'message': 'Eror del servidor','data': err});
                },
                incorrect: function () {
                    return res.send({'success': false,'message': 'Contraseña incorrecta'});
                },
                success: function () {
                    user.password = '';
                    sails.log('User '+ user.id +' has logged in.');
                    return res.send({
                    'success': true,
                    'message': 'Peticion realizada',
                    'data': user
                    });

                },
                });
            })
    },
    file: function(req, res){
        var
            params = req.allParams()
        ;
        req.file('file').upload({
            //dirname: require('path').resolve(sails.config.appPath, 'assets/images')
            dirname: require('path').resolve(sails.config.appPath, '.tmp/public/images')
        },function (err, uploadFiles) {
            if(err){
                return reject(err);
            }
            // sails.log.info(98, uploadFiles);
            req.file('file').upload({
                dirname: require('path').resolve(sails.config.appPath, 'assets/images')
                //dirname: require('path').resolve(sails.config.appPath, '.tmp/public/images')
            },function (err, uploadFiles) {
                if(err){
                    return reject(err);
                }
                // sails.log.info(98, uploadFiles);
                res.ok(uploadFiles);
            })
            ;
            //res.ok(uploadFiles);
        })
        ;
    },
    deletefile: function(req, res){
      const fs = require('fs');
      var
        params = req.allParams()
      ;
      if(params.name){
        // fs.unlinkSync("./assets/images/34456d48-f8c4-4997-845c-7e5c3ae9b8bd.jpg");
        fs.unlinkSync("./assets/"+params.name);
        res.ok({
          'msg': 'Eliminado'
        });
      }
    },
    fecha: function(req, res) {
        var
            params = req.allParams()
        ;
        var fechaHoy = new Date();
        var fechaMañana  = new Date(fechaHoy.setDate(fechaHoy.getDate() + 1));
        fechaHoy = new Date();
        var fechaAyer  = new Date(fechaHoy.setDate(fechaHoy.getDate() - 1));
        fechaHoy = new Date();
        return res.ok({fechaHoy: fechaHoy, fechaManana: fechaMañana, fechaAyer: fechaAyer});
    },
    validarDatosUser: function(req, res) {
        
    }
};
