var app = angular.module('clienteModule',[]);

app.controller('clienteControl',function($scope,$http, $compile){
	
	var url = 'http://localhost:8080/SistemaEcommerce/rs/cliente';
	$scope.cliente = {};
	$scope.telefones = {};

	$scope.pesquisar = function(){
		$http.get(url).success(function (clientesRetorno) {
			$scope.clientes = clientesRetorno;
			$scope.telefones = $scope.clientes.telefones;
		}).error(function(mensagemErro) {
			$scope.mensagens.push('Erro ao pesquisar clientes '+mensagemErro);
		});   
	}		
	
	$scope.novo = function(){
		$scope.cliente = {};
		$scope.mensagens = [];
	}
	
	$scope.montaMensagemErro = function(listaErro) {
		$scope.mensagens = [];
		$scope.mensagens.push('Falha de validação retornada do servidor');
		angular.forEach(listaErro, function(value, key){
			 $scope.mensagens.push(value.message);
		});
	}

    $scope.salvar = function() {    	
    	if ($scope.cliente.codigo == undefined || $scope.cliente.codigo == '') {
			
			$scope.cliente.telefones = $scope.telefones;
			console.log($scope.telefones);

			$http.post(url,$scope.cliente).success(function(cliente) {
				$scope.clientes.push($scope.cliente);
				$scope.novo();
				$scope.mensagens.push('Cliente salvo com sucesso');
				if ($scope.form) $scope.form.$setPristine();
			}).error(function (erro) {
				//$scope.mensagens.push('Erro ao salvar cliente: '+JSON.stringify(erro));
				$scope.montaMensagemErro(erro.parameterViolations);
			});
		} else {
			$http.put(url,$scope.cliente).success(function(cliente) {
				$scope.pesquisar();
				$scope.novo();
				$scope.mensagens.push('Cliente atualizado com sucesso');
			}).error(function (erro) {
				$scope.montaMensagemErro(erro.parameterViolations);
			});
		}		
	}
	
	$scope.excluir = function() {
		if ($scope.cliente.codigo == '') {
			alert('Selecione um cliente');
		} else {
			urlExcluir = url+'/'+$scope.cliente.codigo;
			$http.delete(urlExcluir).success(function () {
				$scope.pesquisar();
				$scope.novo();
				$scope.mensagens.push('Cliente excluído com sucesso');
			}).error(function (erro) {
				$scope.mensagens.push('Erro ao excluir cliente: '+erro);
			});
		}
	}
	
    
	var inputCounter = 1;

	$scope.addPhoneGroup = function() {
										
		var input = angular.element(
			'<div class="phone-group col-sm-12">'+
				'<div class="form-group col-sm-6">'+
					'<label for="exampleInputPais">Número</label>'+
					'<input type="text" class="form-control" ng-model="telefones['+inputCounter+'].numero" name="pais" placeholder="Insira o número">'+
				'</div>'+
				'<div class="form-group col-sm-6">'+
					'<label for="exampleInputPais">Tipo</label>'+
					'<select class="form-control" ng-model="telefones['+inputCounter+'].tipo" name="tipo_telefone">'+
						'<option value="celular">Celular</option>'+
						'<option value="comercial">Comercial</option>'+
						'<option value="residencial">Residencial</option>'+
						'<option value="fax">Fax</option>'+
					'</select>'+
				'</div>'+
			'</div>'
		);

		var compile = $compile(input)($scope);
      	$('#phone-list').append(input);
        inputCounter++;

	}

	$scope.seleciona = function(clienteTabela) {
		$scope.cliente = clienteTabela;
	}

	$scope.pesquisar();
	$scope.novo();
});