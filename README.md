```
RF => Requisitos Funcionais

RNF => Requisitos Não Funcionais

RN => Regra de Negócio
```

# Cadastro de carro

**RF**

- Deve ser possível cadastrar um novo carro.

**RN**

- \*O usuário responsável pelo cadastro deve ser admistrador.
- Não deve ser possível cadastrar um carro com uma placa já existente.
- O carro deve ser cadastrado como disponivel por padrão.

# Listagem de carros

**RF**

- Deve ser possível listar todos os carros disponíveis.
- Deve ser possível listar todos os carros disponíveis pelo nome da categoria.
- Deve ser possível listar todos os carros disponíveis pelo nome da marca.
- Deve ser possível listar todos os carros disponíveis pelo nome do carro.

**RN**

- Não é necessário estar logado.

# Cadastro de Especificação no Carro

**RF**

- Deve ser possível cadastrar uma especificação para um carro.

**RN**

- Não deve ser possível cadastrar uma especificação para um carro não cadastrado.
- Não deve ser possível cadastrar uma especificação ja cadastrada no mesmo carro.
- O usuário responsável pelo cadastro deve ser admistrador.

# Cadastro de imagens do carro

**RF**

- Deve ser possível cadastrar a imagem do carro.
- Deve ser possível listar todas os carros.

**RNF**

- Utilizar o multer para upload dos arquivos.

**RN**

- O usuário deve poder cadastrar mais de uma imagem para o mesmo carro.
- O usuário responsável pelo cadastro deve ser admistrador.

# Alugel de carro

**RF**

- Deve ser possível cadastrar um alugel.

**RN**

- O alugel deve ter duração mínima de 24 horas.
- Não deve ser possível cadastrar um novo alugel caso já exista um aberto para o mesmo usuário.
- Não deve ser possível cadastrar um novo alugel caso já exista um aberto para o mesmo carro.
