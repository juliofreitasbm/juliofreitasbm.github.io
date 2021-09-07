let tamanhoDoCromossomo = 44;
let tamanhoDaPopulacao = 100;
let numeroDeGeracoes = 40;
let taxaDeCrossover = 0.65;
let taxaDeMutacao = 0.008;


function gerarIndividuoAleatorio() {
	let stringBinaria = '';
	for(var i = 0; i < tamanhoDoCromossomo; i++) {
		do {
			numeroAleatorio = Math.random();
		} while(numeroAleatorio === 0.5);

		if(numeroAleatorio < 0.5)
			stringBinaria += '0';
		else
			stringBinaria += '1';
	}

	return {
		cromossomo: stringBinaria,
		aptidao: gerarAptidaoPorCromossomo(stringBinaria),
	}; 
}

function gerarAptidaoPorCromossomo(cromossomo) {
	let xInicial = cromossomo.slice(0, tamanhoDoCromossomo/2);
	let yInicial = cromossomo.slice(tamanhoDoCromossomo/2, tamanhoDoCromossomo);

	//console.log(cromossomo + '\n' + xInicial + ' ' + yInicial);

	let xDecimal = parseInt(xInicial, 2);
	let yDecimal = parseInt(yInicial, 2);	

	let xMultiplicado = xDecimal * (200/((2**22)-1));
	let yMultiplicado = yDecimal * (200/((2**22)-1));

	let xFinal = xMultiplicado - 100;
	let yFinal = yMultiplicado - 100;

	//console.log(xInicial, xDecimal, xMultiplicado, xFinal);
	//console.log(yInicial, yDecimal, yMultiplicado, yFinal);

	function calcularAptidao(x, y) {
		return ( 0.5 - (((Math.sin(Math.sqrt(x**2 + y**2))**2) - 0.5)/(1.0 + 0.001 * (x**2 + y**2))**2) );
	}
	//console.log(calcularAptidao(xFinal, yFinal));

	return calcularAptidao(xFinal, yFinal);
}

function gerarPopulacaoAleatoria() {
	let vetorDeBinarios = [];
	for(var i = 0; i < tamanhoDaPopulacao; i++) {
		vetorDeBinarios.push(gerarIndividuoAleatorio());
	}
	return vetorDeBinarios;
}

function calcularSomaDasAptidoes(populacao) {
	return populacao.map(elemento => elemento.aptidao).reduce((total, numero) => total + numero);
}

function numeroFloatAleatorioEmIntervalo(min, max) {
	return Math.random() * (max - min) + min;
}

function numeroInteiroAleatorioEmIntervalo(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function selecionarCasal(populacao) {
	let somaDasAptidoes = calcularSomaDasAptidoes(populacao);
	//console.log('SOMA DAS APTIDOES E: ' + somaDasAptidoes);

	let pai = selecionarIndividuo(populacao);
	let mae = null;

	do {
		mae = selecionarIndividuo(populacao);
	} while(mae.cromossomo == pai.cromossomo);

	function selecionarIndividuo(populacao) {
		let	valorSorteado = numeroFloatAleatorioEmIntervalo(0, somaDasAptidoes);
		//console.log("valorSorteado: " + valorSorteado)
		let somatorio = 0;
		let contador = 0;

		for(const individuo of populacao) {
			somatorio += individuo.aptidao;
			//console.log(contador)
			//contador++;
			if(somatorio >= valorSorteado) {
				return individuo;
			}
		}
		console.log("Erro em selecionarIndividuo " + somatorio)
	}

	return {
		pai: pai,
		mae: mae
	}
}

function gerarFilhos(pais) {
	filhos = crossover(pais);

	filhos.filho1 = mutacao(filhos.filho1);
	filhos.filho2 = mutacao(filhos.filho2);
	
	return filhos;
}

function crossover(pais) {
	let filhos = {
		filho1: null,
		filho2: null
	};
	let valorSorteado = Math.random();

	if(valorSorteado >= taxaDeCrossover) {
		filhos.filho1 = pais.pai;
		filhos.filho2 = pais.mae;
	}
	else {
		let indexDeCorte = numeroInteiroAleatorioEmIntervalo(0, tamanhoDoCromossomo - 1);
		paiEsquerda = pais.pai.cromossomo.slice(0, indexDeCorte);
		paiDireita = pais.pai.cromossomo.slice(indexDeCorte, tamanhoDoCromossomo);

		maeEsquerda = pais.mae.cromossomo.slice(0, indexDeCorte);
		maeDireita = pais.mae.cromossomo.slice(indexDeCorte, tamanhoDoCromossomo);

		filhos.filho1 = {
			cromossomo: paiEsquerda + maeDireita,
			aptidao: gerarAptidaoPorCromossomo(paiEsquerda + maeDireita)
		};
		filhos.filho2 = {
			cromossomo: maeEsquerda + paiDireita,
			aptidao: gerarAptidaoPorCromossomo(maeEsquerda + paiDireita)
		};
	}

	//console.log(pais);

	return filhos;
}

function mutacao(individuo) {

	for(i = 0; i < tamanhoDoCromossomo; i++){
		let valorSorteado = Math.random();
		//console.log(individuo.cromossomo[i])
		if(valorSorteado < taxaDeMutacao){
			if(individuo.cromossomo[i] === '0'){
				if(i != tamanhoDoCromossomo - 1) 
					individuo.cromossomo =  individuo.cromossomo.slice(0, i) + '1' + individuo.cromossomo.slice(i + 1, tamanhoDoCromossomo);
				else
					individuo.cromossomo =  individuo.cromossomo.slice(0, i) + '1';
			}
			else {
				if(i != tamanhoDoCromossomo - 1) 
					individuo.cromossomo =  individuo.cromossomo.slice(0, i) + '0' + individuo.cromossomo.slice(i + 1, tamanhoDoCromossomo);
				else
					individuo.cromossomo =  individuo.cromossomo.slice(0, i) + '0';
			}

		}
	}

	return individuo;
}

function mediaDasAptidoes(populacao) {
	return calcularSomaDasAptidoes(populacao)/tamanhoDaPopulacao;
}

function selecionarIndividuoMaisApto(populacao) {
	let vetorDeAptidoes = populacao.map(individuo => individuo.aptidao);
	let aptidaoMaisAlta = vetorDeAptidoes.reduce((a, b) => Math.max(a, b));

	return populacao.find( elemento => elemento.aptidao === aptidaoMaisAlta);
}

function elitismo(populacao, individuo) {
	populacao[numeroInteiroAleatorioEmIntervalo(0, populacao.length - 1)] = individuo;

	return populacao;
}


function algoritmoGenetico() {
	let populacao = gerarPopulacaoAleatoria();
	let reprodutores = [];
	let populacaoFilhos = [];

	data = document.getElementById("data");
	data.innerHTML = '';
	mudandoInputs();

	for(var i = 0; i <= numeroDeGeracoes; i++){

		media = mediaDasAptidoes(populacao);

		for(var j = 0; j < tamanhoDaPopulacao/2 ; j++) {

			pais = selecionarCasal(populacao);

			
			reprodutores.push(pais.pai);
			reprodutores.push(pais.mae);

			filhos = gerarFilhos(pais);

			populacaoFilhos.push(filhos.filho1);
			populacaoFilhos.push(filhos.filho2);
		}

		individuoMaisApto = selecionarIndividuoMaisApto(reprodutores);

		//console.log(populacao);
		console.log('G-' + i + ', MEDIA: ' + media + ', MAIOR APTIDAO: ' + individuoMaisApto.aptidao);
		apresentarGeracaoNaDOM(i, media, individuoMaisApto.aptidao);
	
		populacao = populacaoFilhos;
		populacao = elitismo(populacao, individuoMaisApto);

		//console.log(populacao);
		populacaoFilhos = [];
		reprodutores = [];
	}
}

function apresentarGeracaoNaDOM(geracao, media, maiorAptidao) {
	data = document.getElementById("data");

	htmlInserido = `
		<div class="linha">
			<div class="geracao">Geração: ${geracao}</div>
			<div class="media">Média: ${media}</div>
			<div class="mais-apto">Mais Apto: ${maiorAptidao}</div>
		</div>
	`
	data.insertAdjacentHTML('beforeend', htmlInserido);
}

function mudandoInputs() {
	tamanhoDoCromossomo = document.getElementById("tamanho-cromossomo").value;
	tamanhoDaPopulacao = document.getElementById("tamanho-populacao").value;
	numeroDeGeracoes = document.getElementById("numero-geracoes").value;
	taxaDeCrossover = document.getElementById("taxa-crossover").value;
	taxaDeMutacao = document.getElementById("taxa-mutacao").value;
}

function reiniciarInputs() {
	document.getElementById("tamanho-cromossomo").value = 44;
	document.getElementById("tamanho-populacao").value = 100;
	document.getElementById("numero-geracoes").value = 40;
	document.getElementById("taxa-crossover").value = 0.65;
	document.getElementById("taxa-mutacao").value = 0.008;
}