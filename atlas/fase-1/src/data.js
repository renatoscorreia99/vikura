/* Atlas — dados de demonstração da Fase 1.
   Registros nomeados: fatos históricos conhecidos, com datas indicativas e SEM revisão de fontes.
   Registros simulados: pontos anônimos gerados por semente, só para testar densidade. */
window.ATLAS = (function () {
  const LANES = [
    { id: 'am', name: 'Américas', lines: ['Américas'] },
    { id: 'af', name: 'África', lines: ['África'] },
    { id: 'eu', name: 'Europa', lines: ['Europa'] },
    { id: 'ao', name: 'Ásia Ocidental e Central', lines: ['Ásia Ocidental', 'e Central'] },
    { id: 'as', name: 'Sul da Ásia', lines: ['Sul da Ásia'] },
    { id: 'al', name: 'Leste e Sudeste Asiático', lines: ['Leste e Sudeste', 'Asiático'] },
    { id: 'oc', name: 'Oceania e Pacífico', lines: ['Oceania', 'e Pacífico'] }
  ];
  const CATS = [
    { id: 'poder', name: 'Poder e conflito' },
    { id: 'arte', name: 'Arte e arquitetura' },
    { id: 'saber', name: 'Ciência e técnica' },
    { id: 'fe', name: 'Religião e pensamento' },
    { id: 'troca', name: 'Rotas e trocas' },
    { id: 'vida', name: 'Sociedade e cotidiano' }
  ];
  const KINDS = { ev: 'Acontecimento', pr: 'Processo', ob: 'Objeto', co: 'Construção', do: 'Documento' };
  const PREC = {
    e: 'data exata', c: 'data aproximada', i: 'intervalo documentado',
    ci: 'intervalo estimado', s: 'datação por século', d: 'data debatida'
  };

  // [id, faixa, início, fim, precisão, categoria, tipo, peso, título, lugar, lon, lat, silhueta, rótulo de data]
  const RAW = [
    // Américas
    ['haud', 'am', 1142, 1451, 'd', 'poder', 'pr', 1, 'Formação da Confederação Haudenosaunee', 'Grandes Lagos', -76.1, 42.9, null, 'entre 1142 e 1451'],
    ['quipu', 'am', 1400, 1532, 's', 'saber', 'ob', 2, 'Quipu inca', 'Andes centrais', -72.0, -13.5, 'quipu', 'sécs. XV–XVI'],
    ['triplice', 'am', 1428, null, 'e', 'poder', 'ev', 2, 'Formação da Tríplice Aliança', 'Tenochtitlan', -99.13, 19.43],
    ['pachacuti', 'am', 1438, null, 'c', 'poder', 'ev', 2, 'Pachacuti inicia a expansão inca', 'Cusco', -71.97, -13.52],
    ['machu', 'am', 1450, null, 'c', 'arte', 'co', 3, 'Machu Picchu', 'Vale do Urubamba', -72.55, -13.16, 'edificio'],
    ['chanchan', 'am', 1470, null, 'c', 'poder', 'ev', 1, 'Incas tomam Chan Chan, capital chimu', 'Costa norte dos Andes', -79.07, -8.1],
    ['coyol', 'am', 1473, null, 'c', 'arte', 'ob', 2, 'Pedra de Coyolxauhqui', 'Tenochtitlan', -99.13, 19.43, 'disco'],
    ['templo', 'am', 1487, null, 'e', 'fe', 'ev', 2, 'Reconsagração do Templo Mayor', 'Tenochtitlan', -99.13, 19.43],
    ['colombo', 'am', 1492, null, 'e', 'troca', 'ev', 3, 'Colombo chega às Antilhas', 'Guanahani', -74.5, 24.0],
    ['cabral', 'am', 1500, null, 'e', 'troca', 'ev', 2, 'Frota de Cabral chega à costa do atual Brasil', 'Porto Seguro', -39.06, -16.45],
    ['pedrasol', 'am', 1502, 1521, 'ci', 'arte', 'ob', 3, 'Pedra do Sol', 'Tenochtitlan', -99.13, 19.43, 'disco'],
    ['tenoch', 'am', 1519, 1521, 'i', 'poder', 'pr', 3, 'Guerra e queda de Tenochtitlan', 'Vale do México', -99.13, 19.43],
    ['cajamarca', 'am', 1532, null, 'e', 'poder', 'ev', 3, 'Captura de Atahualpa em Cajamarca', 'Cajamarca', -78.5, -7.16],
    ['mendoza', 'am', 1541, null, 'c', 'saber', 'do', 2, 'Códice Mendoza', 'Cidade do México', -99.13, 19.43, 'manuscrito'],
    ['potosi', 'am', 1545, null, 'e', 'troca', 'ev', 2, 'Começa a mineração de prata em Potosí', 'Potosí', -65.75, -19.58],
    ['florentino', 'am', 1545, 1577, 'ci', 'saber', 'do', 2, 'Códice Florentino', 'Nova Espanha', -99.13, 19.43, 'manuscrito'],
    ['salvador', 'am', 1549, null, 'e', 'poder', 'ev', 1, 'Fundação de Salvador', 'Baía de Todos os Santos', -38.5, -12.97],
    ['univ', 'am', 1551, null, 'e', 'saber', 'ev', 1, 'Fundadas as universidades de Lima e do México', 'Lima', -77.04, -12.05],
    // África
    ['sankore', 'af', 1400, 1600, 's', 'saber', 'do', 2, 'Manuscritos de Tombuctu', 'Tombuctu', -3.0, 16.77, 'manuscrito', 'sécs. XV–XVI'],
    ['ceuta', 'af', 1415, null, 'e', 'poder', 'ev', 2, 'Portugal toma Ceuta', 'Ceuta', -5.31, 35.89],
    ['zimbabue', 'af', 1450, null, 'c', 'vida', 'ev', 2, 'Declínio do Grande Zimbábue', 'Planalto do Zimbábue', 30.93, -20.27],
    ['sunniali', 'af', 1464, 1492, 'i', 'poder', 'pr', 2, 'Reinado de Sunni Ali, expansão do Songhai', 'Gao', -0.04, 16.27],
    ['tombuctu', 'af', 1468, null, 'e', 'poder', 'ev', 2, 'Songhai toma Tombuctu', 'Tombuctu', -3.0, 16.77],
    ['mina', 'af', 1482, null, 'e', 'troca', 'co', 2, 'Feitoria de São Jorge da Mina', 'Costa do Ouro', -1.35, 5.08, 'edificio'],
    ['dias', 'af', 1488, null, 'e', 'troca', 'ev', 2, 'Bartolomeu Dias contorna o cabo da Boa Esperança', 'Cabo da Boa Esperança', 18.47, -34.36],
    ['saleiro', 'af', 1490, 1530, 'ci', 'arte', 'ob', 2, 'Saleiro de marfim sapi-português', 'Serra Leoa', -12.5, 8.5, 'vaso'],
    ['kongo', 'af', 1491, null, 'e', 'fe', 'ev', 2, 'Batismo de Nzinga a Nkuwu, rei do Kongo', 'Mbanza Kongo', 14.25, -6.27],
    ['askia', 'af', 1493, 1528, 'i', 'poder', 'pr', 2, 'Reinado de Askia Muhammad', 'Gao', -0.04, 16.27],
    ['melinde', 'af', 1498, null, 'e', 'troca', 'ev', 1, 'Vasco da Gama em Melinde', 'Melinde', 40.12, -3.22],
    ['idia', 'af', 1500, 1550, 's', 'arte', 'ob', 3, 'Máscara pendente da rainha-mãe Idia', 'Reino do Benin', 5.62, 6.34, 'mascara', 'início do séc. XVI'],
    ['quiloa', 'af', 1505, null, 'e', 'poder', 'ev', 1, 'Portugueses saqueiam Quíloa', 'Quíloa', 39.5, -8.96],
    ['cairo', 'af', 1517, null, 'e', 'poder', 'ev', 3, 'Otomanos conquistam o Cairo mameluco', 'Cairo', 31.24, 30.04],
    ['adal', 'af', 1529, 1543, 'i', 'poder', 'pr', 1, 'Guerra entre Adal e Etiópia', 'Planalto etíope', 39.0, 11.0],
    ['placas', 'af', 1550, 1650, 's', 'arte', 'ob', 3, 'Placas de bronze do Benin', 'Cidade do Benin', 5.62, 6.34, 'placa', 'sécs. XVI–XVII'],
    ['alcacer', 'af', 1578, null, 'e', 'poder', 'ev', 2, 'Batalha de Alcácer-Quibir', 'Norte do Marrocos', -5.9, 35.0],
    ['tondibi', 'af', 1591, null, 'e', 'poder', 'ev', 3, 'Batalha de Tondibi, fim do Império Songhai', 'Curva do Níger', -0.2, 16.6],
    // Europa
    ['renasc', 'eu', 1400, 1600, 'ci', 'arte', 'pr', 1, 'Renascimento italiano', 'Península Itálica', 11.26, 43.77],
    ['duomo', 'eu', 1420, 1436, 'i', 'arte', 'co', 3, 'Cúpula de Santa Maria del Fiore', 'Florença', 11.26, 43.77, 'cupula'],
    ['eyck', 'eu', 1434, null, 'e', 'arte', 'ob', 2, 'O Casal Arnolfini, de Jan van Eyck', 'Bruges', 3.22, 51.21, 'pintura'],
    ['gutenberg', 'eu', 1455, null, 'c', 'saber', 'do', 3, 'Bíblia de Gutenberg', 'Mainz', 8.27, 50.0, 'manuscrito'],
    ['venus', 'eu', 1485, null, 'c', 'arte', 'ob', 2, 'O Nascimento de Vênus, de Botticelli', 'Florença', 11.26, 43.77, 'pintura'],
    ['vitruv', 'eu', 1490, null, 'c', 'saber', 'ob', 2, 'Homem Vitruviano, de Leonardo', 'Milão', 9.19, 45.46, 'pintura'],
    ['granada', 'eu', 1492, null, 'e', 'poder', 'ev', 2, 'Rendição de Granada', 'Granada', -3.6, 37.18],
    ['tordesilhas', 'eu', 1494, null, 'e', 'poder', 'do', 2, 'Tratado de Tordesilhas', 'Tordesilhas', -5.0, 41.5],
    ['ceia', 'eu', 1495, 1498, 'ci', 'arte', 'ob', 2, 'A Última Ceia, de Leonardo', 'Milão', 9.19, 45.46, 'pintura'],
    ['davi', 'eu', 1501, 1504, 'i', 'arte', 'ob', 2, 'Davi, de Michelangelo', 'Florença', 11.26, 43.77, 'escultura'],
    ['monalisa', 'eu', 1503, 1519, 'ci', 'arte', 'ob', 3, 'Mona Lisa', 'Florença', 11.26, 43.77, 'pintura'],
    ['sistina', 'eu', 1508, 1512, 'i', 'arte', 'ob', 3, 'Teto da Capela Sistina', 'Roma', 12.45, 41.9, 'pintura'],
    ['melencolia', 'eu', 1514, null, 'e', 'arte', 'ob', 1, 'Melencolia I, de Dürer', 'Nuremberg', 11.08, 49.45, 'pintura'],
    ['lutero', 'eu', 1517, null, 'e', 'fe', 'ev', 3, 'Lutero divulga as 95 teses', 'Wittenberg', 12.65, 51.87],
    ['magalhaes', 'eu', 1519, 1522, 'i', 'troca', 'pr', 3, 'Circum-navegação de Magalhães e Elcano', 'Sanlúcar de Barrameda', -6.35, 36.78],
    ['viena', 'eu', 1529, null, 'e', 'poder', 'ev', 1, 'Primeiro cerco otomano de Viena', 'Viena', 16.37, 48.21],
    ['copernico', 'eu', 1543, null, 'e', 'saber', 'do', 3, 'De revolutionibus, de Copérnico', 'Nuremberg', 11.08, 49.45, 'manuscrito'],
    ['vesalio', 'eu', 1543, null, 'e', 'saber', 'do', 2, 'De humani corporis fabrica, de Vesálio', 'Basileia', 7.59, 47.56, 'manuscrito'],
    ['trento', 'eu', 1545, 1563, 'i', 'fe', 'pr', 2, 'Concílio de Trento', 'Trento', 11.12, 46.07],
    ['mercator', 'eu', 1569, null, 'e', 'saber', 'do', 2, 'Mapa-múndi de Mercator', 'Duisburgo', 6.76, 51.43, 'mapa'],
    ['lepanto', 'eu', 1571, null, 'e', 'poder', 'ev', 1, 'Batalha de Lepanto', 'Golfo de Patras', 21.3, 38.2],
    ['lusiadas', 'eu', 1572, null, 'e', 'arte', 'do', 2, 'Os Lusíadas, de Camões', 'Lisboa', -9.14, 38.72, 'manuscrito'],
    ['gregoriano', 'eu', 1582, null, 'e', 'saber', 'ev', 2, 'Adoção do calendário gregoriano', 'Roma', 12.45, 41.9],
    ['armada', 'eu', 1588, null, 'e', 'poder', 'ev', 2, 'Derrota da Invencível Armada', 'Canal da Mancha', -1.0, 50.2],
    // Ásia Ocidental e Central
    ['ancara', 'ao', 1402, null, 'e', 'poder', 'ev', 2, 'Batalha de Ancara', 'Ancara', 32.85, 39.93],
    ['ulugh', 'ao', 1420, 1429, 'ci', 'saber', 'co', 3, 'Observatório de Ulugh Beg', 'Samarcanda', 66.97, 39.67, 'astrolabio'],
    ['zij', 'ao', 1437, null, 'e', 'saber', 'do', 2, 'Zij-i Sultani, catálogo de estrelas', 'Samarcanda', 66.97, 39.67, 'manuscrito'],
    ['constant', 'ao', 1453, null, 'e', 'poder', 'ev', 3, 'Otomanos conquistam Constantinopla', 'Constantinopla', 28.98, 41.01],
    ['topkapi', 'ao', 1459, 1478, 'ci', 'arte', 'co', 1, 'Palácio de Topkapı', 'Istambul', 28.98, 41.01, 'edificio'],
    ['safavida', 'ao', 1501, null, 'e', 'poder', 'ev', 2, 'Ismail I funda a dinastia safávida', 'Tabriz', 46.29, 38.08],
    ['piri', 'ao', 1513, null, 'e', 'saber', 'do', 3, 'Mapa de Piri Reis', 'Galípoli', 26.67, 40.41, 'mapa'],
    ['chaldiran', 'ao', 1514, null, 'e', 'poder', 'ev', 2, 'Batalha de Chaldiran', 'Chaldiran', 44.4, 39.1],
    ['solimao', 'ao', 1520, 1566, 'i', 'poder', 'pr', 2, 'Reinado de Solimão, o Magnífico', 'Istambul', 28.98, 41.01],
    ['shahnameh', 'ao', 1524, 1535, 'ci', 'arte', 'do', 2, 'Shahnameh de Shah Tahmasp', 'Tabriz', 46.29, 38.08, 'manuscrito'],
    ['ardabil', 'ao', 1539, 1540, 'i', 'arte', 'ob', 3, 'Tapete de Ardabil', 'Ardabil', 48.29, 38.25, 'tapete'],
    ['suleymaniye', 'ao', 1550, 1557, 'i', 'arte', 'co', 2, 'Mesquita Süleymaniye, de Sinan', 'Istambul', 28.98, 41.01, 'cupula'],
    ['iznik', 'ao', 1575, null, 'c', 'arte', 'ob', 2, 'Prato de cerâmica de İznik', 'İznik', 29.72, 40.43, 'disco'],
    ['isfahan', 'ao', 1598, null, 'e', 'poder', 'ev', 2, 'Isfahan torna-se capital safávida', 'Isfahan', 51.67, 32.65],
    // Sul da Ásia
    ['nanak', 'as', 1469, null, 'e', 'fe', 'ev', 2, 'Nascimento de Guru Nanak', 'Punjab', 73.7, 31.45],
    ['gama', 'as', 1498, null, 'e', 'troca', 'ev', 3, 'Vasco da Gama chega a Calicute', 'Calicute', 75.78, 11.26],
    ['vitthala', 'as', 1500, 1565, 's', 'arte', 'co', 1, 'Templo de Vitthala', 'Hampi', 76.46, 15.33, 'edificio', 'séc. XVI'],
    ['krishna', 'as', 1509, 1529, 'i', 'poder', 'pr', 2, 'Reinado de Krishnadevaraya em Vijayanagara', 'Hampi', 76.46, 15.33],
    ['goa', 'as', 1510, null, 'e', 'poder', 'ev', 2, 'Portugueses tomam Goa', 'Goa', 73.9, 15.5],
    ['panipat', 'as', 1526, null, 'e', 'poder', 'ev', 3, 'Batalha de Panipat, início do Império Mogol', 'Panipat', 76.97, 29.39],
    ['akbar', 'as', 1556, 1605, 'i', 'poder', 'pr', 2, 'Reinado de Akbar', 'Agra', 78.0, 27.18],
    ['hamzanama', 'as', 1562, 1577, 'ci', 'arte', 'do', 2, 'Hamzanama, manuscrito ilustrado mogol', 'Corte mogol', 77.66, 27.09, 'manuscrito'],
    ['talikota', 'as', 1565, null, 'e', 'poder', 'ev', 2, 'Batalha de Talikota', 'Decão', 76.3, 16.5],
    ['humayun', 'as', 1565, 1572, 'ci', 'arte', 'co', 2, 'Túmulo de Humayun', 'Délhi', 77.25, 28.59, 'cupula'],
    ['fatehpur', 'as', 1571, 1585, 'i', 'arte', 'co', 2, 'Fatehpur Sikri, capital de Akbar', 'Fatehpur Sikri', 77.66, 27.09, 'edificio'],
    // Leste e Sudeste Asiático
    ['zhenghe', 'al', 1405, 1433, 'i', 'troca', 'pr', 3, 'Viagens de Zheng He', 'Nanquim', 118.78, 32.06],
    ['proibida', 'al', 1406, 1420, 'i', 'arte', 'co', 3, 'Cidade Proibida', 'Pequim', 116.39, 39.92, 'edificio'],
    ['yongle', 'al', 1408, null, 'e', 'saber', 'do', 2, 'Enciclopédia Yongle', 'Nanquim', 118.78, 32.06, 'manuscrito'],
    ['xuande', 'al', 1426, 1435, 'i', 'arte', 'ob', 2, 'Porcelana azul e branca do reinado Xuande', 'Jingdezhen', 117.18, 29.27, 'vaso'],
    ['le', 'al', 1428, null, 'e', 'poder', 'ev', 1, 'Lê Lợi funda a dinastia Lê', 'Thăng Long', 105.85, 21.03],
    ['angkor', 'al', 1431, null, 'c', 'poder', 'ev', 2, 'Ayutthaya toma Angkor', 'Angkor', 103.87, 13.41],
    ['hangul', 'al', 1443, 1446, 'i', 'saber', 'do', 3, 'Hangul, o Hunminjeongeum', 'Hanseong', 126.98, 37.57, 'manuscrito'],
    ['onin', 'al', 1467, 1477, 'i', 'poder', 'pr', 2, 'Guerra de Ōnin', 'Quioto', 135.77, 35.01],
    ['ginkaku', 'al', 1482, 1490, 'ci', 'arte', 'co', 1, 'Ginkaku-ji, o Pavilhão de Prata', 'Quioto', 135.77, 35.01, 'edificio'],
    ['sesshu', 'al', 1495, null, 'e', 'arte', 'ob', 2, 'Haboku sansui, de Sesshū', 'Yamaguchi', 131.47, 34.18, 'pintura'],
    ['malaca', 'al', 1511, null, 'e', 'poder', 'ev', 3, 'Portugueses tomam Malaca', 'Malaca', 102.25, 2.19],
    ['mactan', 'al', 1521, null, 'e', 'poder', 'ev', 2, 'Batalha de Mactan', 'Mactan', 123.96, 10.31],
    ['majapahit', 'al', 1527, null, 'c', 'poder', 'ev', 1, 'Fim de Majapahit', 'Java', 112.38, -7.56],
    ['tanegashima', 'al', 1543, null, 'e', 'troca', 'ev', 2, 'Portugueses chegam a Tanegashima', 'Tanegashima', 130.97, 30.6],
    ['macau', 'al', 1557, null, 'e', 'troca', 'ev', 2, 'Portugueses estabelecem-se em Macau', 'Macau', 113.54, 22.2],
    ['bencao', 'al', 1578, null, 'e', 'saber', 'do', 2, 'Bencao Gangmu, de Li Shizhen', 'Hubei', 115.4, 30.2, 'manuscrito'],
    ['hideyoshi', 'al', 1590, null, 'e', 'poder', 'ev', 2, 'Hideyoshi unifica o Japão', 'Odawara', 139.15, 35.25],
    ['imjin', 'al', 1592, 1598, 'i', 'poder', 'pr', 2, 'Guerra Imjin', 'Península coreana', 127.5, 36.5],
    ['sekigahara', 'al', 1600, null, 'e', 'poder', 'ev', 2, 'Batalha de Sekigahara', 'Sekigahara', 136.47, 35.37],
    // Oceania e Pacífico
    ['nanmadol', 'oc', 1200, 1600, 'ci', 'arte', 'co', 2, 'Nan Madol', 'Pohnpei', 158.33, 6.84, 'edificio'],
    ['tonga', 'oc', 1200, 1500, 'ci', 'poder', 'pr', 1, 'Auge da rede marítima de Tuʻi Tonga', 'Tonga', -175.2, -21.13],
    ['moai', 'oc', 1250, 1600, 'ci', 'arte', 'co', 3, 'Construção dos moai', 'Rapa Nui', -109.35, -27.11, 'moai'],
    ['pa', 'oc', 1500, null, 'c', 'vida', 'ev', 1, 'Difusão dos pā fortificados', 'Aotearoa', 175.0, -39.0],
    ['guam', 'oc', 1521, null, 'e', 'troca', 'ev', 2, 'Frota de Magalhães chega a Guam', 'Guam', 144.79, 13.44],
    ['mendana', 'oc', 1568, null, 'e', 'troca', 'ev', 1, 'Mendaña chega às ilhas Salomão', 'Ilhas Salomão', 160.0, -9.5],
    // Trecho pouco preenchido (cena 6)
    ['carlos', 'eu', 800, null, 'e', 'poder', 'ev', 1, 'Coroação de Carlos Magno', 'Roma', 12.45, 41.9],
    ['maia', 'am', 800, 950, 'ci', 'vida', 'pr', 2, 'Abandono das cidades maias do sul', 'Petén', -89.6, 17.2],
    ['khmer', 'al', 802, null, 'c', 'poder', 'ev', 2, 'Jayavarman II funda o Império Khmer', 'Phnom Kulen', 104.1, 13.6],
    ['sabedoria', 'ao', 830, null, 'c', 'saber', 'ev', 2, 'Casa da Sabedoria em Bagdá', 'Bagdá', 44.36, 33.31],
    ['sutra', 'al', 868, null, 'e', 'saber', 'do', 3, 'Sutra do Diamante, livro impresso datado', 'Dunhuang', 94.66, 40.14, 'manuscrito'],
    ['song', 'al', 960, null, 'e', 'poder', 'ev', 1, 'Fundação da dinastia Song', 'Kaifeng', 114.3, 34.8],
    ['fatimida', 'af', 969, null, 'e', 'poder', 'ev', 2, 'Fatímidas fundam o Cairo', 'Cairo', 31.24, 30.04],
    ['meadows', 'am', 1021, null, 'e', 'troca', 'ev', 2, 'Nórdicos em L’Anse aux Meadows', 'Terra Nova', -55.53, 51.6]
  ];
  const laneIx = Object.fromEntries(LANES.map((l, i) => [l.id, i]));
  const RECS = RAW.map(r => ({
    id: r[0], lane: laneIx[r[1]], laneId: r[1], s: r[2], e: r[3] == null ? r[2] : r[3], range: r[3] != null,
    prec: r[4], cat: r[5], kind: r[6], imp: r[7], title: r[8], place: r[9], lon: r[10], lat: r[11],
    glyph: r[12] || null, dl: r[13] || null
  }));
  const byId = Object.fromEntries(RECS.map(r => [r.id, r]));

  // Textos de demonstração para os registros abertos nas cenas.
  const TEXT = {
    piri: {
      kindLabel: 'Documento · carta náutica',
      dating: '1513 · data exata, registrada no próprio mapa como 919 AH',
      body: [
        'Carta desenhada em pergaminho pelo almirante e cartógrafo otomano Piri Reis. O fragmento que sobreviveu mostra as costas atlânticas da Europa e da África e parte do litoral da América do Sul.',
        'Nas anotações, o autor diz ter combinado cerca de vinte mapas mais antigos, entre eles um atribuído a Colombo. Em 1517 a carta foi apresentada ao sultão Selim I, no Egito. Foi reencontrada em 1929, no Palácio de Topkapı.'
      ],
      links: [['colombo', 'fonte citada nas anotações'], ['tordesilhas', 'o mundo que o mapa registra'], ['cairo', 'ano em que foi entregue ao sultão'], ['magalhaes', 'próxima grande viagem']]
    },
    idia: {
      kindLabel: 'Objeto · marfim esculpido',
      dating: 'início do séc. XVI · datação por século',
      body: [
        'Pendente de marfim associado à corte do Benin e à rainha-mãe Idia, mãe do obá Esigie. No alto da cabeça, uma fileira de pequenas figuras alterna rostos de portugueses e peixes.',
        'Dois exemplares muito parecidos estão hoje em museus fora da Nigéria.'
      ],
      links: [['placas', 'mesma tradição de corte'], ['mina', 'contato com os portugueses na costa']]
    }
  };

  const LINKS = [
    ['piri', 'colombo'], ['piri', 'tordesilhas'], ['piri', 'cairo'], ['piri', 'magalhaes'],
    ['dias', 'gama'], ['melinde', 'gama'], ['gama', 'goa'], ['goa', 'malaca'], ['malaca', 'macau'], ['macau', 'tanegashima'],
    ['zhenghe', 'proibida'], ['zhenghe', 'xuande'], ['gutenberg', 'lutero'], ['gutenberg', 'copernico'],
    ['colombo', 'tordesilhas'], ['colombo', 'tenoch'], ['cabral', 'tordesilhas'], ['magalhaes', 'guam'], ['guam', 'mactan'],
    ['constant', 'topkapi'], ['constant', 'solimao'], ['solimao', 'suleymaniye'], ['solimao', 'viena'], ['ulugh', 'zij'],
    ['idia', 'placas'], ['mina', 'idia'], ['sunniali', 'tombuctu'], ['tombuctu', 'askia'], ['askia', 'tondibi'],
    ['panipat', 'akbar'], ['akbar', 'fatehpur'], ['akbar', 'hamzanama'], ['tenoch', 'pedrasol'], ['tenoch', 'mendoza'],
    ['cajamarca', 'potosi'], ['pachacuti', 'machu'], ['safavida', 'chaldiran'], ['safavida', 'ardabil'], ['ardabil', 'shahnameh'],
    ['duomo', 'venus'], ['venus', 'davi'], ['davi', 'sistina'], ['lutero', 'trento'], ['copernico', 'gregoriano'],
    ['ceuta', 'mina'], ['cairo', 'chaldiran'], ['onin', 'hideyoshi'], ['hideyoshi', 'imjin']
  ];

  // Sociedades e Estados de longa duração: [faixa, início, fim, nome]. Datas arredondadas.
  const POLS = [
    ['am', -3000, -1800, 'Caral'], ['am', -1200, -400, 'Olmecas'], ['am', -900, -200, 'Chavín'],
    ['am', 100, 550, 'Teotihuacan'], ['am', 250, 900, 'Maias, período clássico'], ['am', 500, 1000, 'Wari e Tiwanaku'],
    ['am', 1050, 1350, 'Cahokia'], ['am', 1428, 1521, 'Mexicas'], ['am', 1438, 1533, 'Tawantinsuyu (Incas)'],
    ['am', 1521, 1825, 'Domínio colonial ibérico'],
    ['af', -3100, -30, 'Egito faraônico'], ['af', -1070, 350, 'Kush'], ['af', -814, -146, 'Cartago'],
    ['af', 100, 940, 'Axum'], ['af', 700, 1100, 'Gana (Wagadu)'], ['af', 1100, 1450, 'Grande Zimbábue'],
    ['af', 1235, 1600, 'Mali'], ['af', 1180, 1897, 'Reino do Benin'], ['af', 1390, 1857, 'Reino do Kongo'],
    ['af', 1464, 1591, 'Songhai'], ['af', 1270, 1974, 'Etiópia salomônica'],
    ['eu', -2000, -1450, 'Creta minoica'], ['eu', -800, -146, 'Pólis gregas'], ['eu', -509, 476, 'Roma'],
    ['eu', 330, 1453, 'Império Romano do Oriente'], ['eu', 751, 888, 'Carolíngios'], ['eu', 962, 1806, 'Sacro Império'],
    ['eu', 882, 1240, 'Rus de Kiev'], ['eu', 1139, 1910, 'Reino de Portugal'], ['eu', 1479, 1700, 'Espanha dos Habsburgo'],
    ['ao', -3000, -2000, 'Suméria e Acádia'], ['ao', -1894, -539, 'Babilônia'], ['ao', -550, -330, 'Aquemênidas'],
    ['ao', -247, 224, 'Partas'], ['ao', 224, 651, 'Sassânidas'], ['ao', 661, 1258, 'Califados omíada e abássida'],
    ['ao', 1206, 1368, 'Império Mongol'], ['ao', 1370, 1507, 'Timúridas'], ['ao', 1299, 1922, 'Império Otomano'],
    ['ao', 1501, 1736, 'Safávidas'],
    ['as', -2600, -1900, 'Civilização do Indo'], ['as', -1500, -500, 'Período védico'], ['as', -322, -185, 'Máurias'],
    ['as', 320, 550, 'Guptas'], ['as', 848, 1279, 'Cholas'], ['as', 1206, 1526, 'Sultanato de Délhi'],
    ['as', 1336, 1646, 'Vijayanagara'], ['as', 1526, 1857, 'Império Mogol'],
    ['al', -1600, -1046, 'Shang'], ['al', -1046, -256, 'Zhou'], ['al', -202, 220, 'Han'], ['al', 618, 907, 'Tang'],
    ['al', 960, 1279, 'Song'], ['al', 802, 1431, 'Império Khmer'], ['al', 1368, 1644, 'Ming'], ['al', 1392, 1897, 'Joseon'],
    ['al', 1336, 1573, 'Xogunato Ashikaga'], ['al', 1293, 1527, 'Majapahit'], ['al', 1644, 1912, 'Qing'],
    ['oc', -300000, 2025, 'Povos aborígenes da Austrália, presença contínua'], ['oc', -1600, -500, 'Cultura Lapita'],
    ['oc', 900, 1300, 'Povoamento da Polinésia Oriental'], ['oc', 950, 1865, 'Tuʻi Tonga']
  ].map((p, i) => ({ id: 'p' + i, lane: laneIx[p[0]], s: p[1], e: p[2], name: p[3] }));

  // Marcos do tempo profundo (só no panorama). Datas arqueológicas, sujeitas a revisão.
  const DEEP = [
    ['af', -300000, 'Homo sapiens em Jebel Irhoud'], ['oc', -60000, 'Chegada a Sahul'],
    ['al', -43500, 'Arte rupestre em Sulawesi'], ['eu', -34000, 'Gruta de Chauvet'],
    ['am', -21000, 'Pegadas de White Sands'], ['ao', -9500, 'Göbekli Tepe'], ['as', -7000, 'Mehrgarh']
  ].map((d, i) => ({ id: 'd' + i, lane: laneIx[d[0]], s: d[1], e: d[1], name: d[2], deep: true }));

  // Simulação de escala: ~2.900 registros anônimos entre 1400 e 1600.
  // O peso por região repete de propósito o viés das fontes mais acessíveis (Europa super-representada).
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const rnd = mulberry(1513);
  const gauss = () => { let u = 0; for (let i = 0; i < 4; i++) u += rnd(); return (u - 2) / 0.58; };
  const pick = (w) => { let r = rnd() * w.reduce((a, b) => a + b, 0); for (let i = 0; i < w.length; i++) { r -= w[i]; if (r <= 0) return i; } return w.length - 1; };
  const laneW = [0.10, 0.09, 0.34, 0.13, 0.10, 0.20, 0.04]; // am af eu ao as al oc
  const catW = [0.30, 0.24, 0.14, 0.12, 0.12, 0.08];
  const peaks = [[1453, 6], [1500, 12], [1519, 7], [1545, 8], [1588, 9], [1420, 8]];
  const SIM = [];
  for (let i = 0; i < 2900; i++) {
    const lane = pick(laneW);
    let y; const m = rnd();
    if (m < 0.42) y = 1400 + rnd() * 200;
    else if (m < 0.62) y = 1400 + 200 * Math.sqrt(rnd());
    else { const p = peaks[Math.floor(rnd() * peaks.length)]; y = p[0] + gauss() * p[1]; }
    if (lane === 6 && rnd() < 0.5) y = 1400 + rnd() * 200;
    if (y < 1400 || y > 1600) y = 1400 + rnd() * 200;
    SIM.push({ lane, s: y, cat: CATS[pick(catW)].id, v: rnd() });
  }

  const ROMAN = { 15: 'XV', 16: 'XVI', 17: 'XVII', 9: 'IX', 10: 'X', 11: 'XI' };
  function fmtYear(y) {
    y = Math.round(y);
    if (y <= -10000) return Math.round(-y / 1000).toLocaleString('pt-BR') + ' mil AEC';
    if (y < 0) return (-y) + ' AEC';
    if (y === 0) return '1 AEC';
    return String(y);
  }
  function fmtDate(r) {
    if (r.dl) return r.dl;
    if (r.prec === 'e') return String(r.s);
    if (r.prec === 'c') return 'c. ' + r.s;
    if (r.prec === 'i') return r.s + '–' + r.e;
    if (r.prec === 'ci') return 'c. ' + r.s + '–' + r.e;
    return r.s + '–' + r.e;
  }

  // Silhuetas ilustrativas (caixa 100 x 120). Ocupam o lugar das fotografias de acervo.
  function glyph(name) {
    const c = 'currentColor', k = 'style="fill:var(--cut)"', ks = 'style="stroke:var(--cut)"';
    switch (name) {
      case 'mapa': {
        let rays = '';
        [[34, 74], [72, 34]].forEach(([cx, cy]) => { for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; rays += `<line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(a) * 90).toFixed(1)}" y2="${(cy + Math.sin(a) * 90).toFixed(1)}" stroke="${c}" stroke-width=".6" opacity=".55"/>`; } });
        return `<defs><clipPath id="gm"><rect x="12" y="14" width="76" height="92"/></clipPath></defs><rect x="12" y="14" width="76" height="92" fill="${c}" opacity=".16"/><g clip-path="url(#gm)">${rays}<path d="M88 14v92H62c-4-8 2-14-2-22s-12-8-10-18 10-10 8-20-10-12-6-22 12-6 14-10z" fill="${c}" opacity=".8"/><path d="M12 30c8 2 10 10 6 16s-6 10-6 16z" fill="${c}" opacity=".8"/></g><circle cx="34" cy="74" r="3" fill="${c}"/><circle cx="72" cy="34" r="2.2" fill="${c}"/>`;
      }
      case 'mascara': {
        let dots = ''; for (let i = 0; i < 9; i++) { const a = Math.PI * (1.12 + i * 0.095); dots += `<circle cx="${(50 + Math.cos(a) * 31).toFixed(1)}" cy="${(60 + Math.sin(a) * 44).toFixed(1)}" r="3.4" fill="${c}"/>`; }
        let col = ''; for (let i = 0; i < 7; i++) col += `<rect x="${27 + i * 6.8}" y="100" width="4.6" height="9" fill="${c}"/>`;
        return `${dots}<path d="M50 24c17 0 27 14 27 33 0 24-13 42-27 42S23 81 23 57c0-19 10-33 27-33z" fill="${c}"/><path d="M33 56c5-5 11-5 14 0-4 3-10 3-14 0zM53 56c3-5 9-5 14 0-4 3-10 3-14 0z" ${k}/><path d="M47 62h6l3 14h-12z" ${k} opacity=".55"/><path d="M41 84h18" ${ks} stroke-width="2.4" fill="none"/>${col}`;
      }
      case 'vaso':
        return `<path d="M40 14h20v9c0 4 4 6 9 10 9 7 15 17 15 30 0 18-10 32-20 37v6H36v-6C26 95 16 81 16 63c0-13 6-23 15-30 5-4 9-6 9-10z" fill="${c}"/><path d="M18 56h64M17 66h66" ${ks} stroke-width="1.6" fill="none"/><path d="M34 76c6 8 10 8 16 0 6 8 10 8 16 0" ${ks} stroke-width="1.6" fill="none"/><path d="M38 26h24" ${ks} stroke-width="1.4"/>`;
      case 'manuscrito': {
        let ln = ''; for (let i = 0; i < 9; i++) ln += `<rect x="${i < 3 ? 44 : 24}" y="${30 + i * 8}" width="${i < 3 ? 32 : (i === 8 ? 30 : 52)}" height="2.4" fill="${c}" opacity=".75"/>`;
        return `<rect x="16" y="14" width="68" height="96" fill="${c}" opacity=".18"/><rect x="24" y="28" width="16" height="20" fill="${c}"/><path d="M28 44l4-12 4 12" ${ks} stroke-width="1.6" fill="none"/>${ln}<rect x="24" y="102" width="52" height="1" fill="${c}" opacity=".5"/>`;
      }
      case 'disco': {
        let t = ''; for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12; t += `<line x1="${(50 + Math.cos(a) * 30).toFixed(1)}" y1="${(60 + Math.sin(a) * 30).toFixed(1)}" x2="${(50 + Math.cos(a) * 38).toFixed(1)}" y2="${(60 + Math.sin(a) * 38).toFixed(1)}" ${ks} stroke-width="2"/>`; }
        return `<circle cx="50" cy="60" r="41" fill="${c}"/>${t}<circle cx="50" cy="60" r="25" fill="none" ${ks} stroke-width="1.6"/><circle cx="50" cy="60" r="16" fill="none" ${ks} stroke-width="1.6"/><circle cx="50" cy="60" r="7" ${k}/>`;
      }
      case 'pintura':
        return `<rect x="16" y="14" width="68" height="92" fill="${c}" opacity=".2"/><rect x="16" y="14" width="68" height="92" fill="none" stroke="${c}" stroke-width="5"/><circle cx="50" cy="48" r="11" fill="${c}"/><path d="M28 104c0-24 8-38 22-38s22 14 22 38z" fill="${c}"/>`;
      case 'escultura':
        return `<circle cx="50" cy="20" r="8" fill="${c}"/><path d="M38 32h24l4 30h-7l-2 34H43l-2-34h-7z" fill="${c}"/><rect x="28" y="98" width="44" height="12" fill="${c}" opacity=".6"/>`;
      case 'tapete':
        return `<rect x="20" y="8" width="60" height="104" fill="${c}"/><rect x="26" y="14" width="48" height="92" fill="none" ${ks} stroke-width="1.6"/><rect x="31" y="19" width="38" height="82" fill="none" ${ks} stroke-width=".9"/><path d="M50 40l12 20-12 20-12-20z" ${k}/><circle cx="50" cy="60" r="5" fill="${c}"/><path d="M31 19h10a10 10 0 01-10 10zM69 19v10a10 10 0 01-10-10zM31 101v-10a10 10 0 0110 10zM69 101h-10a10 10 0 0110-10z" ${k} opacity=".8"/>`;
      case 'quipu': {
        let s = ''; for (let i = 0; i < 11; i++) { const x = 16 + i * 6.8, L = 46 + ((i * 37) % 48); s += `<line x1="${x}" y1="22" x2="${x + (i % 3 - 1) * 2}" y2="${22 + L}" stroke="${c}" stroke-width="1.5"/>`; for (let j = 0; j < 1 + (i * 7) % 3; j++) s += `<circle cx="${x + (i % 3 - 1) * 1}" cy="${36 + j * 14 + (i * 5) % 9}" r="2.3" fill="${c}"/>`; }
        return `<path d="M8 24c22-6 60-6 84 0" fill="none" stroke="${c}" stroke-width="3.4" stroke-linecap="round"/>${s}`;
      }
      case 'astrolabio':
        return `<circle cx="50" cy="16" r="6" fill="none" stroke="${c}" stroke-width="3"/><circle cx="50" cy="66" r="40" fill="${c}"/><circle cx="50" cy="66" r="31" fill="none" ${ks} stroke-width="1.4"/><circle cx="50" cy="56" r="17" fill="none" ${ks} stroke-width="1.2"/><path d="M18 88L82 44" ${ks} stroke-width="3" /><circle cx="50" cy="66" r="3.4" ${k}/>`;
      case 'placa':
        return `<rect x="18" y="10" width="64" height="100" fill="${c}"/><circle cx="50" cy="40" r="11" ${k}/><path d="M36 100V66c0-7 6-12 14-12s14 5 14 12v34z" ${k}/><circle cx="27" cy="19" r="3.4" ${k}/><circle cx="73" cy="19" r="3.4" ${k}/><circle cx="27" cy="101" r="3.4" ${k}/><circle cx="73" cy="101" r="3.4" ${k}/><path d="M22 60h10M68 60h10" ${ks} stroke-width="3"/>`;
      case 'moai':
        return `<path d="M36 8h30l4 24-4 5v10l6 9v10l-6 4v10l10 8v24H26V88l8-8V46l-3-8z" fill="${c}"/><path d="M38 34h28" ${ks} stroke-width="4"/><path d="M40 70h20" ${ks} stroke-width="2.4"/>`;
      case 'cupula':
        return `<rect x="47" y="8" width="6" height="12" fill="${c}"/><circle cx="50" cy="22" r="5" fill="${c}"/><path d="M18 76c0-30 14-50 32-50s32 20 32 50z" fill="${c}"/><rect x="14" y="78" width="72" height="30" fill="${c}" opacity=".62"/><path d="M34 76c2-22 8-38 16-48M66 76c-2-22-8-38-16-48M50 28v48" ${ks} stroke-width="1.3" fill="none"/><path d="M44 108V92a6 6 0 0112 0v16z" ${k}/>`;
      default: // edificio em terraços
        return `<rect x="38" y="26" width="24" height="16" fill="${c}"/><rect x="28" y="44" width="44" height="16" fill="${c}" opacity=".9"/><rect x="18" y="62" width="64" height="18" fill="${c}" opacity=".78"/><rect x="8" y="82" width="84" height="24" fill="${c}" opacity=".62"/><path d="M45 106V92h10v14z" ${k}/><path d="M46 42v-8h8v8z" ${k}/>`;
    }
  }

  const glyphSvg = (name, attrs) => `<svg viewBox="0 0 100 120" ${attrs || ''}>${glyph(name)}</svg>`;

  return { glyphSvg, LANES, CATS, KINDS, PREC, RECS, byId, TEXT, LINKS, POLS, DEEP, SIM, fmtYear, fmtDate, glyph, laneIx, ROMAN };
})();
