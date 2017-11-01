var express = require('express'),
    bodyParser = require('body-parser'),
    //io = require('socket.io-client'),
    //net = require('net'),
    cors = require('cors');
var router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(cors());

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};




router.get('/', function(req, res, next) {
  const sendcode = 'MASTER|MASTER||-1,' + req.query.days + '|0|' + req.query.code + '|0;1;2;3;4;6\r';
  const net = require('net');
  var str = "";
  var client = net.connect({port: 905, host: 'www.master.tw'}, function() {
      client.write(sendcode);
  });
  client.on('data', (data) => {
    str += data.toString().replaceAll(',', '\t').replaceAll('\\|', '\n');

    if(str.indexOf(String.fromCharCode(0x0D)) !== -1) {
      if(str.indexOf("19110000") !== -1) {
        res.send("Unable to find stock: " + req.query.code);
      } else {
        str = "date\topen\thigh\tlow\tclose\tvolume\n".concat(str);
        res.send(str);
    }
    }
  });
  //client.on('close', () => {
    //console.log('disconnected from server');
  //});
});

module.exports = router;
