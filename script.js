/* ===== CARROSSEL AUTOMÁTICO ===== */
let carouselIndex = 0;
const carouselImages = document.querySelectorAll('.carousel img');

function showCarouselImage() {
  carouselImages.forEach(img => img.classList.remove('active'));
  carouselImages[carouselIndex].classList.add('active');
  carouselIndex = (carouselIndex + 1) % carouselImages.length;
}

setInterval(showCarouselImage, 3000);
showCarouselImage();

/* ===== LOOP DE IMAGENS NO HOVER ===== */
document.querySelectorAll('.produto').forEach(produto => {
  let intervalId;
  const imagens = produto.querySelectorAll('img');
  let index = 0;

  produto.addEventListener('mouseenter', () => {
    if (imagens.length > 1) {
      intervalId = setInterval(() => {
        imagens.forEach(img => img.style.display = 'none');
        imagens[index].style.display = 'block';
        index = (index + 1) % imagens.length;
      }, 800); // tempo entre imagens
    }
  });

  produto.addEventListener('mouseleave', () => {
    clearInterval(intervalId);
    imagens.forEach((img, i) => img.style.display = i === 0 ? 'block' : 'none');
    index = 0;
  });
});

/* ===== CÁLCULO DE FRETE - API CORREIOS ===== */
function calcularFrete() {
  const cepDestino = document.getElementById('cep').value.replace(/\D/g, '');
  const cepOrigem = "01001-000"; // Trocar pelo seu CEP de origem
  const peso = 1; // Peso em kg
  const formato = 1; // Caixa/Pacote
  const comprimento = 20; // cm
  const altura = 5; // cm
  const largura = 15; // cm
  const servico = "04014"; // SEDEX: 04014 / PAC: 04510

  if (cepDestino.length !== 8) {
    alert("Digite um CEP válido.");
    return;
  }

  const url = `https://cors-anywhere.herokuapp.com/http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx/CalcPrecoPrazo?` +
              `nCdEmpresa=&sDsSenha=&nCdServico=${servico}&sCepOrigem=${cepOrigem}&sCepDestino=${cepDestino}` +
              `&nVlPeso=${peso}&nCdFormato=${formato}&nVlComprimento=${comprimento}&nVlAltura=${altura}` +
              `&nVlLargura=${largura}&nVlDiametro=0&sCdMaoPropria=n&nVlValorDeclarado=0&sCdAvisoRecebimento=n&StrRetorno=xml`;

  fetch(url)
    .then(res => res.text())
    .then(xmlString => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      const valor = xmlDoc.getElementsByTagName("Valor")[0].childNodes[0].nodeValue;
      const prazo = xmlDoc.getElementsByTagName("PrazoEntrega")[0].childNodes[0].nodeValue;
      document.getElementById('resultado-frete').innerText = `Valor: R$ ${valor} - Prazo: ${prazo} dias úteis`;
    })
    .catch(err => {
      console.error(err);
      alert("Erro ao calcular o frete. Verifique o CEP.");
    });
}

document.getElementById('btn-calcular-frete').addEventListener('click', calcularFrete);
