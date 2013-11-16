// (function(){
	console.log('Start loading the extension');

	// var html = '';
	// document.getElementsByTagName('body')[0].innerHTML += html;

	var s = document.createElement('ul');
	s.id = 'msg';
	s.style.cssText="border: 1px solid #000; background: #eee; width: 300px; word-wrap: break-word; position: fixed; top: 0px; right: 0px; z-index: 1000000000; max-height: 100px; overflow-y: scroll;";
	s.innerHTML = 'Hello';
	document.documentElement.appendChild(s);

	var pebblepresenter_io = window.pebblepresenter_io;
	var pebblePresenter = {
		init: function(){
			// Initialize the socket connection

			var socket = pebblepresenter_io.connect('http://pebblepresenter.syvarth.com');
			pebblePresenter.data = {
				page_url: document.URL,
				pebble_auth: null,
			}

			socket.emit('registerPresentation', pebblePresenter.data);

			socket.on('presentationInfo', function(data){
				pebblePresenter.log(data);
			});

			socket.on('changeSlide', function(data){
				pebblePresenter.log(data);
				if(data.direction=='next'){
					player.playerViewModel.next();
				} else if( data.direction=='back'){
					player.playerViewModel.back();
				}
			});
		},

		log: function( data ) {
			var elem = document.getElementById('msg');
			elem.innerHTML = '<li>'+JSON.stringify(data)+'</li>' + elem.innerHTML;
			console.log(data);
		}
	};


	pebblePresenter.init();
// });