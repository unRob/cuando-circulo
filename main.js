var dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

var proxima_verificacion = function(placa) {
	var ultimo = lib.ultimo_digito(placa);
	var esteMes = new Date().getMonth();
	var verifica = pvv.terminaciones[ultimo].verifica;

	// if (verifica.indexOf(esteMes) > -1) {

	// } else {
	// 	verifica.forEach(function(mes){

	// 	});
	// }
};

document.addEventListener('DOMContentLoaded', function(){

	var storage = window.localStorage;
	//dom
	var setup = document.querySelector('#setup');
	var result = document.querySelector('#result');
	var resultText = document.querySelector('#hoy-circulo');
	var resultRazon = document.querySelector('#razon');
	var warn = document.querySelector('#warn');


	var doSetup = function(evt) {
		evt.preventDefault();
		var domPlaca = document.querySelector('#placa');
		var placa = domPlaca.value.replace(/\D/g, '+');
		var holograma = (function(els){
			var num;
			[].forEach.call(els, function(el){
				if (el.checked) {
					num = el.value;
				}
			});
			return parseInt(num, 10);
		})(document.getElementsByName('holograma'));

		if (!placa || placa.length < 3 || placa.length > 4) {
			
			alert("Parece que no has introducido correctamente los datos de tu placa :(");
			domPlaca.focus();
			return;
		}

		if ([0,1,2].indexOf(holograma) < 0) {
			alert("Es necesario que elijas el holograma de tu vehículo");
			return;
		}

		console.log('storing...');
		storage.placa = placa;
		storage.holograma = holograma;


		result.classList.remove('hidden');
		setup.classList.add('hidden');
		showResult();
	};

	var showResult = function(){

		var d = new Date();
		//var d = new Date(1898,10,21,16);
		var mi_auto = new Auto(storage.placa, storage.holograma);
		var clase;

		var result = Circula(mi_auto, d);

		clase = result.circula ? 'yay' : 'nay';
		if (result.warn) {
			warn.innerText = result.warn;
			clase = 'warn';
			warn.className = '';
		} else {
			warn.className = 'hidden';
		}
		resultText.className = clase;
		resultText.innerText = result.circula ? 'Sí' : 'No';
		resultRazon.innerText = result.razon;
		
	};

	if (storage.placa) {
		result.classList.remove('hidden');
		showResult();
	} else {
		setup.classList.remove('hidden');
	}

	if (storage.placa) {
		document.querySelector('#placa').value = storage.placa;
	}

	if (storage.holograma) {
		document.querySelector('input[value="'+storage.holograma+'"]').checked = 'checked';
	}

	document.querySelector('#guardar-placa').addEventListener('mouseup', doSetup);
	document.querySelector('#guardar-placa').addEventListener('touchend', doSetup);

	var showSetup = function(evt) {
		evt.preventDefault();
		setup.classList.remove('hidden');
		result.classList.add('hidden');
	};
	document.querySelector('#reset').addEventListener('mousedown', showSetup);
	document.querySelector('#reset').addEventListener('touchend', showSetup);
	//document.querySelector('#guardar-placa').addEventListener('mouseup', doSetup);

});