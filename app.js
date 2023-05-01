const { app, BrowserWindow } = require('electron');
const express = require('express');
const path = require('path');
const request = require('request');
const DELAY = 500;

request({
  url: 'http://localhost:3000',
  method: 'GET'
}, (err) => {
  if (err && err.code === 'ECONNREFUSED') {
    const server = express();
    const http = require('http').Server(server);
    const io = require('socket.io')(http);

    io.on('connection', (socket) => {
      socket.on('quit', () => app.quit());
    });

    server.use('/', express.static(`${ __dirname }/public`));
    http.listen(3000, '0.0.0.0');

    io.on('connection', (socket) => {
      socket.on('disconnect', () => {
        app.quit();
      });
    });
  }
});

app.on('ready', () => {
  setTimeout(() => {
    const window = new BrowserWindow();

    window.loadURL('http://localhost:3000');
  }, DELAY);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
