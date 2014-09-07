(function(){

	var entre_semana = function(auto, date) {
		if (auto.holograma === 0) {
			return true;
		}
		
		return auto.info.descansa !== date.getDay();
	};
	var los_sabados = function(auto, date) {
		if (auto.holograma === 0) {
			return true;
		}
		
		if (auto.holograma === 2) {
			return false;
		}

		//es 1 entonces..

		var sabados = (function(dia){
			dia = new Date(dia);
			var mes = dia.getMonth();
			var ret = [];
			while (dia.getMonth() === mes) {
				if (dia.getDay() === 6)
					ret.push(dia.getDate())
				dia = new Date(dia.setDate(dia.getDate()+1));
			}
			return ret;
		})(date.setDate(1))

		var numSabado = sabados.indexOf(date.getDay())+1
		if (numSabado == 5) {
			return true;
		}

		var par = auto.ultimo_digito() % 2 == 0;
		return (numSabado%2==0) ? par : !par;

	};

	var dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];



	var Circula = function(auto, fecha){
		var r = {};
		if (auto.holograma === 0) {
			r.circula = true;
			r.razon = "Tú circulas todos los días, chatoa!";
		} else {
			fecha = fecha || new Date();
			var numDia = fecha.getDay();

			if (numDia === 0) {
				r.circula = true;
				r.razon = "Todos los vehículos circula el día domingo";
			} else if (numDia <= 5) {
				r.circula = entre_semana(auto, fecha);
				info = auto.info;
				r.razon = r.circula ? 
					"Los vehículos engomado color "+auto.info.nombre+" circulan hoy y descansan el "+dias[info.descansa-1] :
					"Los vehículos con placa terminación "+auto.ultimo_digito()+" no circulan los días "+dias[numDia-1];
			} else {
				r.circula = los_sabados(auto, fecha);
				r.razon = "Tu vehículo holograma "+auto.holograma+" ";

				if (auto.holograma == 2) {
					r.razon += "no circula ningún sábado del mes";
				} else {
					var placaPar = (auto.ultimo_digito() % 2);
					var numero = '';
					var impar = 'primer y tercer';
					var par = 'segundo y cuarto';
					if (r.circula) {
						r.razon += " circula el "+
						(placaPar ? impar : par)+
						" sábado del mes";
					} else {
						r.razon += " no circula el "+
						(placaPar ? par : impar)+
						" sábado del mes";
					}
				}
				
			}

			r.razon += '.';

			if (!r.circula) {
				antes5 = (fecha.getHours() < 5);
				despues10 = (fecha.getHours() > 21);

				if (antes5 || despues10) {
					r.circula = true;
					r.warn = antes5 ? "de 5:00am a 10:00pm no circulas!" : "Sólamente pasado de las 10:00pm"
				} else {
					r.warn = "Sólo circulas después de las 10:00pm";
				}
			}

		}
		return r;
	};

	if (typeof module !== 'undefined') {
		module.exports = Circula;
	} else {
		window.Circula = Circula;
	}

})()