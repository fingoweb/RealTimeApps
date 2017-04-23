const feathers = require('feathers');
const socketio = require('feathers-socketio');
const handler = require('feathers-errors/handler');
const r = require('rethinkdbdash')({
  db: 'realtimeapp'
});
const rethinkdb = require('feathers-rethinkdb');
const app = feathers();

app.configure(socketio());

app.use('/comments', rethinkdb({
  Model: r,
  name: 'comments'
}));

app.use('/', feathers.static(__dirname));
app.use(handler());
app.listen(3001);


