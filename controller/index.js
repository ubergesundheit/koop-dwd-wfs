var BaseController = require('koop-server/lib/BaseController.js');

var Controller = function( Wfs ){

  // inherit from the base controller to share some logic
  var controller = {};
  controller.__proto__ = BaseController();

  // respond to the root route
  controller.index = function(req, res){
    res.send('This is a sample provider');
  };

  // get a resource from the providers model
  controller.get = function(req, res){
    Wfs.find(req.params.id, req.query, function(err, data){
      if (err){
        res.send(err, 500);
      } else {
        res.json( data );
      }
    });
  };

  // use the shared code in the BaseController to create a feature service
  controller.featureserver = function(req, res){
    var callback = req.query.callback, self = this;
    delete req.query.callback;

    Wfs.find(req.params.id, req.query, function(err, data){
      if (err) {
        res.send(err, 500);
      } else {
        // we remove the geometry if the "find" method already handles geo selection in the cache
        delete req.query.geometry;
        // inherited logic for processing feature service requests
        controller.processFeatureServer( req, res, err, data, callback);
      }
    });
  };

  // render templates and views
  controller.preview = function(req, res){
    res.render(__dirname + '/../views/demo', { locals:{ id: req.params.id } });
  }

  // return the controller so it can be used by koop
  return controller;

};

module.exports = Controller;

