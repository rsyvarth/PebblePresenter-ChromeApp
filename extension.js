// (function(){
	console.log('Start loading the extension');

	var pebblepresenter_io = window.pebblepresenter_io;
	var pebblePresenter = {
		init: function(){
			// Initialize the socket connection

			pebblePresenter.data = {
				page_url: document.URL,
				pebble_auth: null,
				debug: true
			}

			if( pebblePresenter.data.debug ) {
				var s = document.createElement('ul');
				s.id = 'PP_debugmsg';
				s.style.cssText="border: 1px solid #000; background: #eee; width: 300px; word-wrap: break-word; position: fixed; top: 0px; right: 0px; z-index: 1000000000; max-height: 100px; overflow-y: scroll; opacity: 0.5;";
				s.innerHTML = 'Debug Log';
				document.documentElement.appendChild(s);
			}

			var s = document.createElement('div');
			s.id = 'PP_mainContain';
			s.style.cssText="background: #29333f; position: fixed; bottom: 0px; right: 0px; z-index: 1000000000; color: #fff !important; padding: 10px 25px; font-family: arial; text-decoration: none;";
			s.innerHTML = '<a href="#" id="connectToPebbleSocket" onclick="pebblePresenter.connect()" style="color: #fff">+ Present</a>';
			document.documentElement.appendChild(s);
		},

		connect: function( ) {
			document.getElementById('PP_mainContain').innerHTML = 'Loading...';

			if( typeof jQuery == 'undefined') {
				var s = document.createElement('script');
				s.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js";
				s.onload = function() {
				    this.parentNode.removeChild(this);
				    pebblePresenter.bindEvents();
				};
				(document.head||document.documentElement).appendChild(s);
			}

			var socket = pebblepresenter_io.connect('http://pebblepresenter.syvarth.com');

			pebblePresenter.socket = socket;

			socket.emit('registerPresentation', pebblePresenter.data);

			socket.on('presentationInfo', function(data){
				pebblePresenter.log(data);
				pebblePresenter.renderBox(data);
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

		renderBox: function( data ) {
			console.log( data );
			jQuery('#PP_mainContain')
				.html('<h3>Configure Presentation</h3>')
				.css({'width':300,'height':200});

			if( data.pebble_id ) {
				jQuery('#PP_mainContain').append('<div><span style="color: rgb(116,166,55)">Connected</span> to Pebble id '+data.pebble_id+'</div><br />');
			}

			jQuery('#PP_mainContain')
				.append('<div>Auth Code <input type="text" id="PP_authKey" /></div>')
				.append('<div><input type="button" value="Save" id="PP_saveSettings" /><span id="PP_saveResponse"></span></div>');
		},

		bindEvents: function() {
			jQuery(document).on('click','#PP_saveSettings',function(e){
				console.log('Clicked');
				e.preventDefault();
				pebblePresenter.saveSettings();
			});
		},

		saveSettings: function() {
			var auth_id = jQuery('#PP_authKey').val();

			pebblePresenter.socket.emit('updatePresentation', {pebble_auth: auth_id, page_url: pebblePresenter.data.page_url});
		},

		log: function( data ) {
			if( pebblePresenter.data.debug ) {
				var elem = document.getElementById('PP_debugmsg');
				elem.innerHTML = '<li>'+JSON.stringify(data)+'</li>' + elem.innerHTML;
			}
			console.log(data);
		}
	};


	pebblePresenter.init();
// });