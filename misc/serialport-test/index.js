const SerialPort = require('serialport');
const serialPort = new SerialPort('/dev/tty.usbmodem1432401', { // ls /dev/tty.usb*
  baudRate: 115200
});

serialPort.on('open', function () {
  console.log('Communication is on!');

  serialPort.on('data', (data) => {
    console.log(`Data received: ${data}`);
  });
});
