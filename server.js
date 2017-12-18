//console.log("nhan somali");
var express = require("express");//import thu vien
var app = express();
//------------
app.use(express.static("./public"));//tim vao public http:localhost:3000/trangchu
//tao ejs --cau hinh
app.set("view engine","ejs"); //them ejs vao
app.set("views","./views"); //tro vao views
var server = require("http").Server(app);
var io= require("socket.io")(server);//tạo biến io là socket.io
server.listen(3000);//Dua len heroku process.env.PORT ||

var mangUsers=[""]; //khai báo 1 mảng chứa toàn user
//lắng nghe sự kiện có ai đó kết nối gọi điện lên tổng đài...
io.on("connection",function(socket){
	console.log("có người đang truy cập vào trình duyệt: " + socket.id);

	//khi ngời dùng tắt trình duyệt, máy chủ sẽ ngắt kết nối
	socket.on("disconnect", function(){
		console.log(socket.id + "Đã ngắt kết nối với máy chủ !");
		//io.sockets.emit("Server-send-danhsach-Users",);
		//đẩy ra khỏi nhóm online
		mangUsers.splice(
			mangUsers.indexOf(socket.UserName),1
			);
		//server gửi cho các client cập nhật lại danh sách User online
		socket.broadcast.emit("Server-send-danhsach-Users",mangUsers);
	});

	//máy chủ nge sự kiên client gửi dki username
	socket.on("Client-dangki-User",function(data){
		//hàm indexOf có trong file doc ktra có dlieu hay ko
		if (mangUsers.indexOf(data)>=0) {
			socket.emit("Server-send-dki-thatbai");//socket chỉ trả đúng user đó
		}else{
			 mangUsers.push(data);//đẩy dlieu vào mảng để lưu
			 socket.UserName = data; //tạo 1 biến username cho từng user thay vì dùng id của từng user
			 console.log(socket.UserName + ":"+ "Đã đăng nhập thành công !" );
			 socket.emit("Server-send-dki-thanhcong",data);//trả kqa data chỉ cho client đó
			 //báo kqua cho tất cả user bjt =sockets
			 io.sockets.emit("Server-send-danhsach-Users", mangUsers);
		}
	});
	//nhận thông báo client đã Logout và remove id trong dsach online
	socket.on("Logout", function() {
		console.log(socket.UserName + ":" + "Đã ngắt kết nối với với máy chủ !");
		mangUsers.splice(
			mangUsers.indexOf(socket.UserName),1
			);
		//server gửi cho các client cập nhật lại danh sách User online
		socket.broadcast.emit("Server-send-danhsach-Users",mangUsers);


	});
	
	//on--Server nge máy client(user) gửi tin nhắn
	socket.on("user-send-message",function(data){
		//console.log(socket.id + "vừa gửi" + data);
		//emit -- máy chủ gửi tnhan vừa nge, trả về tất cả cho client
	   io.sockets.emit("server-send-message",{un:socket.UserName,nd:data});
	});

	//khi một ai đó đang gõ chữ .....
	socket.on("user-go-chu",function() {
		//console.log(socket.UserName +":"+ "Đang go chu");//test thử server nge ai đó gõ chữ
		var s = socket.UserName +":"+ "đang nhập văn bản ...";//server nge ai đó gõ chữ
		io.sockets.emit("server-gui-user-dang-go-chu",s);//truyền biến s
	});
	//khi một ai đó STOP gõ chữ .....
	socket.on("user-STOP-go-chu",function() {
		//console.log(socket.UserName +":"+ "Đang go chu");//test thử server nge ai đó gõ chữ
		io.sockets.emit("server-gui-user-STOP-go-chu");//truyền biến s
	});
	

});

//tạo route
app.get("/",function(req,res){
	res.render("trangchu");
});
app.get("/dangki",function(req,res){
	res.render("dangki");
});