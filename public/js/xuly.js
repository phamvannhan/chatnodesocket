//Khai báo biến socket để biết đã có ngời truy cập
var socket = io("http://localhost:3000");

//nhận dlieu dang ki that bại từ máy chủ
socket.on("Server-send-dki-thatbai", function() {
	alert("đăng kí thất bại ! Tên đăng nhập đã có sẵn hoặc chưa nhập đúng tên người dùng");
});
//Nhận thông báo dki thành công từ server, nhớ thêm data
socket.on("Server-send-dki-thanhcong", function(data) {
	//alert("đăng kí thành công");currentUser
	alert("đăng kí thành công");
	$("#currentUser").html(data);
	$("#border-dki").hide(2000);
	$("#border-user").show(1000);

	//sau khi dang ki thanh cong tu dang ki
	$("#top").show();
		$("#chat").show(2000);
	
});
//Nhận thông báo kq danh sách online từ server
socket.on("Server-send-danhsach-Users",function(data){
	$("#list-user").html(""); //cho list trong ul danh sách rỗng
	
	/*data.forEach(function(i){
		$("#list-user").append("<div class='user'>" + i + "</div>");//thêm dòng phần tử
	});
	*///sử dụng js map key để hiện ra cái thứ tự id
	data.map(function(i,index){
		if(index >0)
		{
		//	$(".sumuseronline").append("<span class='user'>" +  + "" +  i + "</span>")
			$("#list-user").append("<div class='user'>" + index + "" +  i + "</div>");//thêm dòng phần tử
		}
		
	});
});



//nhận tin nhắn từ máy chủ trả về, data
socket.on('server-send-message', function(data) {
	$("#listMessage").append("<div class='ms'> " + "<span class='name'>"+ data.un + "</span>" +":"+ data.nd + " </div>");
});
//nhận thông báo ai đó đang gõ chữ từ máy chủ trả về, data
socket.on('server-gui-user-dang-go-chu', function(data) {
	$("#thongbao").html(data);
});
//nhận thông báo ai đó STOP gõ chữ từ máy chủ trả về, data
socket.on('server-gui-user-STOP-go-chu', function() {
	$("#thongbao").html("");
});

$(document).ready(function(){
	$("#border-user").hide();
	$("#border-dki").show();
	$("#chat").hide();
	$("#top").hide();
		

	//nhấn nút Đang kí gửi cho server biết
	$("#btnDki").click(function() {
		socket.emit("Client-dangki-User",$("#txtUsername").val());
		
	});
	//nhấn nút logout Gửi cho server biết là đã Logout
	$("#btnLogout").click(function() {
		socket.emit("Logout");
		//alert("chuong");
		$("#border-user").hide();
		$("#top").hide();
		$("#chat").hide();
		$("#border-dki").show();
		//return views('dangki');
	});

	//nhấn nút send để gửi tin nhắn dùng emit để nói cho bên kia nge
	$("#btn-sendMessage").click(function() {
		socket.emit("user-send-message",$("#txtMessage").val());
		$("#txtMessage").val("");
	});
	//khi ai đó đang gõ chữ
	$("#txtMessage").focusin(function(event) {
		socket.emit("user-go-chu");
	});
	//khi ai đó STOP gõ chữ
	$("#txtMessage").focusout(function(event) {
		socket.emit("user-STOP-go-chu");
	});
});


	


	