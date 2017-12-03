var express = require('express');
var app = express();
var http = require('http').Server(app);

var server = require('http').createServer(app);

// http server를 socket.io server로 upgrade
var io = require('socket.io')(server);  

var hostname = "192.168.56.1";
var port = 3000;

//서버에 접속하면 클라이언트로 index.html을 전송
app.get("/",function(req, res){
  res.sendfile("client.html");
});

//누적 이용자 수를 세는 변수
var count=1;

//채팅방 접속
io.on('connection', function(socket){
  var name = "user" + count;
  var msg = name + ' 님이 채팅방에 입장하셨습니다 (id : ' + socket.id + ')';
  console.log(msg);
  io.emit('connectLog', msg);
  count++;
  io.to(socket.id).emit('change name',name);   //새로운 유저의 이름을 바꿔줌

//채팅방 퇴장
  socket.on('disconnect', function(){
   var msg = name + ' 님이 채팅방에서 퇴장하셨습니다 (id : ' + socket.id + ')';
    console.log(msg);
    io.emit('disconnectLog', msg);
  });

//메시지 전송
  socket.on('send message', function(name,text){
    var msg = name + ' : ' + text;
    console.log(msg);
    io.emit('receive message', msg);   //서버가 받은 메시지를 뿌려줌
  });
});

server.listen(port, function(){
  console.log('server running at http://'+hostname+':'+port);
});
