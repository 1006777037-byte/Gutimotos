/* CATÁLOGO DE GUTIMOTOS
   TODOS LOS DATOS SON DE DEMOSTRACIÓN (precios, marcas, compatibilidad y disponibilidad).
   Verifícalos antes de publicar.
   fits: [marca moto, modelo, año desde, año hasta]. universal:true = sirve para cualquier moto.
   disp: "consultar" (por defecto) | "disponible" | "agotado". img: ruta de la foto real (opcional). */
const CATEGORIAS = { frenos:"Frenos", transmision:"Transmisión", motor:"Motor y filtros", electrico:"Eléctrico", llantas:"Llantas", seguridad:"Cascos y seguridad" };

const F = {
  honda:[["Honda","CB 190R",2016,2026],["Honda","XRE 300",2012,2026],["Honda","Wave 110",2010,2026],["Honda","CB 125F",2015,2026]],
  yam:[["Yamaha","FZ 150",2015,2026],["Yamaha","XTZ 125",2008,2026],["Yamaha","R15",2014,2026],["Yamaha","MT-03",2016,2026]],
  suz:[["Suzuki","Gixxer 150",2017,2026],["Suzuki","AX4",2005,2026],["Suzuki","DR 200",2010,2026]],
  baj:[["Bajaj","Pulsar NS 200",2013,2026],["Bajaj","Boxer CT 100",2008,2026],["Bajaj","Dominar 400",2018,2026]],
  akt:[["AKT","NKD 125",2008,2026],["AKT","TT 150",2012,2026],["AKT","CR4 200",2016,2026]],
  kaw:[["Kawasaki","Ninja 400",2018,2026],["Kawasaki","Z400",2019,2026],["Kawasaki","KLX 140",2012,2026]]
};

const PRODUCTS = [
{id:1,sku:"GM-0001",name:"Pastillas de freno delanteras",brand:"EBC",cat:"frenos",price:38000,tags:["destacado"],desc:"Pastillas de frenado progresivo para uso diario.",fits:[...F.honda,...F.yam,...F.suz]},
{id:2,sku:"GM-0002",name:"Disco de freno delantero",brand:"EBC",cat:"frenos",price:165000,desc:"Disco de acero con buena disipación de calor.",fits:[...F.yam,...F.baj]},
{id:3,sku:"GM-0003",name:"Kit de arrastre 428H",brand:"Rinaldi",cat:"transmision",price:98000,oldPrice:125000,tags:["destacado"],desc:"Cadena, piñón y catalina en un solo kit.",fits:[...F.honda,...F.akt,...F.suz,...F.yam]},
{id:4,sku:"GM-0004",name:"Cadena reforzada 520",brand:"DID",cat:"transmision",price:129000,desc:"Cadena reforzada para mayor vida útil.",fits:[...F.kaw,...F.baj,...F.yam]},
{id:5,sku:"GM-0005",name:"Filtro de aceite",brand:"Bosch",cat:"motor",price:18000,desc:"Filtro de papel de alta retención.",fits:[...F.honda,...F.yam,...F.suz,...F.baj,...F.akt]},
{id:6,sku:"GM-0006",name:"Bujía de iridio",brand:"NGK",cat:"motor",price:32000,desc:"Mejor encendido y arranque en frío.",fits:[...F.honda,...F.yam,...F.suz,...F.baj,...F.akt,...F.kaw]},
{id:7,sku:"GM-0007",name:"Aceite 20W-50 semisintético 1 L",brand:"Motul",cat:"motor",price:42000,desc:"Lubricante semisintético para motos de 4 tiempos.",universal:true},
{id:8,sku:"GM-0008",name:"Batería 12V 6Ah sellada",brand:"Yuasa",cat:"electrico",price:115000,tags:["destacado"],desc:"Batería sellada libre de mantenimiento.",fits:[...F.honda,...F.yam,...F.akt,...F.suz]},
{id:9,sku:"GM-0009",name:"Bombillo LED para farola",brand:"Osram",cat:"electrico",price:45000,desc:"Mayor visibilidad con menor consumo.",fits:[...F.honda,...F.yam,...F.suz,...F.baj]},
{id:10,sku:"GM-0010",name:"Llanta trasera 130/70-17",brand:"Pirelli",cat:"llantas",price:245000,oldPrice:269000,desc:"Buen agarre en piso seco y mojado.",fits:[...F.yam,...F.baj,...F.kaw]},
{id:11,sku:"GM-0011",name:"Llanta delantera 90/90-17",brand:"Michelin",cat:"llantas",price:189000,desc:"Dirección precisa y desgaste uniforme.",fits:[...F.honda,...F.suz,...F.akt]},
{id:12,sku:"GM-0012",name:"Casco integral certificado",brand:"Rinaldi",cat:"seguridad",price:210000,tags:["destacado"],desc:"Casco integral con visor y certificación.",universal:true},
{id:13,sku:"GM-0013",name:"Guantes con protección en nudillos",brand:"Rinaldi",cat:"seguridad",price:85000,oldPrice:99000,desc:"Protección para manejo urbano y de carretera.",universal:true},
{id:14,sku:"GM-0014",name:"Pastillas de freno traseras",brand:"EBC",cat:"frenos",price:32000,desc:"Frenado trasero estable y silencioso.",fits:[...F.honda,...F.yam,...F.suz,...F.baj]},
{id:15,sku:"GM-0015",name:"Cable de acelerador",brand:"Genérico",cat:"transmision",price:22000,desc:"Cable con funda reforzada.",fits:[...F.honda,...F.yam,...F.akt]},
{id:16,sku:"GM-0016",name:"Filtro de aire",brand:"Bosch",cat:"motor",price:36000,desc:"Mejor respiración del motor.",fits:[...F.yam,...F.suz,...F.baj]},
{id:17,sku:"GM-0017",name:"Regulador de voltaje",brand:"Genérico",cat:"electrico",price:78000,desc:"Mantiene estable la carga de la batería.",fits:[...F.honda,...F.yam,...F.akt]},
{id:18,sku:"GM-0018",name:"Cámara de aire rin 17",brand:"Michelin",cat:"llantas",price:29000,desc:"Cámara de butilo resistente a pinchazos.",fits:[...F.yam,...F.baj,...F.honda,...F.kaw]}
];
