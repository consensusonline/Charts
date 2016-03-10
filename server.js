#!/usr/bin/env node
var PORT = 8080;
var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(PORT);
console.log("Server started on -> localhost:" + PORT);
