/** A bundled photo: Metro resolves `require('./x.jpg')` to an asset id. */
type Photo = number;

export type Category = 'beaches' | 'mountains' | 'cities' | 'islands';

export type Experience = {
  title: string;
  meta: string;
  photo: Photo;
};

export type Destination = {
  id: string;
  name: string;
  country: string;
  region: string;
  category: Category;
  rating: number;
  reviews: number;
  priceFrom: number;
  nights: number;
  bestTime: string;
  priceBand: string;
  tags: string[];
  blurb: string;
  photo: Photo;
  experiences: Experience[];
};

const photos = {
  santorini: require('../../assets/photos/santorini.jpg') as Photo,
  kyoto: require('../../assets/photos/kyoto.jpg') as Photo,
  bali: require('../../assets/photos/bali.jpg') as Photo,
  dolomites: require('../../assets/photos/dolomites.jpg') as Photo,
  porto: require('../../assets/photos/porto.jpg') as Photo,
  zermatt: require('../../assets/photos/lake.jpg') as Photo,
  tulum: require('../../assets/photos/beach.jpg') as Photo,
};

export const destinations: Destination[] = [
  {
    id: 'santorini',
    name: 'Santorini',
    country: 'Greece',
    region: 'Cyclades',
    category: 'islands',
    rating: 4.8,
    reviews: 1204,
    priceFrom: 890,
    nights: 5,
    bestTime: 'Best May–Oct',
    priceBand: '€€€',
    tags: ['Oia sunset', 'Caldera views', 'Volcanic beaches', 'Wine'],
    blurb:
      'Whitewashed villages stacked over a flooded caldera. Come for the sunsets in Oia, stay for the black-sand beaches and the Assyrtiko.',
    photo: photos.santorini,
    experiences: [
      { title: 'Caldera sailing', meta: 'Half day · $95', photo: photos.tulum },
      { title: 'Red beach', meta: 'Free · Akrotiri', photo: photos.santorini },
    ],
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    region: 'Kansai',
    category: 'cities',
    rating: 4.9,
    reviews: 2318,
    priceFrom: 740,
    nights: 6,
    bestTime: 'Best Mar–May',
    priceBand: '€€',
    tags: ['Temples', 'Cherry blossom', 'Kaiseki', 'Bamboo grove'],
    blurb:
      'A thousand years of capital city, kept in wooden machiya and moss gardens. Walk Higashiyama at dawn before the lanes fill up.',
    photo: photos.kyoto,
    experiences: [
      { title: 'Fushimi Inari at dawn', meta: 'Free · 2 hours', photo: photos.kyoto },
      { title: 'Arashiyama bamboo', meta: 'Half day · $40', photo: photos.dolomites },
    ],
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Lesser Sunda Islands',
    category: 'islands',
    rating: 4.7,
    reviews: 3106,
    priceFrom: 650,
    nights: 7,
    bestTime: 'Best Apr–Oct',
    priceBand: '€€',
    tags: ['Rice terraces', 'Surf', 'Water temples', 'Warungs'],
    blurb:
      'Volcanic ridges falling into rice terraces and reef breaks. Ubud for the temples and the green, the south coast for the surf.',
    photo: photos.bali,
    experiences: [
      { title: 'Ulun Danu temple', meta: 'Half day · $25', photo: photos.bali },
      { title: 'Tegallalang terraces', meta: 'Free · Ubud', photo: photos.kyoto },
    ],
  },
  {
    id: 'lago-di-braies',
    name: 'Lago di Braies',
    country: 'Italy',
    region: 'Dolomites',
    category: 'mountains',
    rating: 4.8,
    reviews: 862,
    priceFrom: 420,
    nights: 3,
    bestTime: 'Best Jun–Sep',
    priceBand: '€€',
    tags: ['Alpine lake', 'Rowboats', 'Hiking', 'Sunrise'],
    blurb:
      'An emerald lake under the Croda del Becco, with a wooden boathouse that has been photographed a million times and still earns it.',
    photo: photos.dolomites,
    experiences: [
      { title: 'Lakeside loop', meta: '1 hour · Free', photo: photos.dolomites },
      { title: 'Rowboat hour', meta: 'From $35', photo: photos.zermatt },
    ],
  },
  {
    id: 'porto',
    name: 'Porto',
    country: 'Portugal',
    region: 'Norte',
    category: 'cities',
    rating: 4.6,
    reviews: 1571,
    priceFrom: 310,
    nights: 4,
    bestTime: 'Best Apr–Oct',
    priceBand: '€',
    tags: ['Douro river', 'Port cellars', 'Azulejos', 'Francesinha'],
    blurb:
      'Tiled façades tumbling down to the Douro, six bridges and a river of port. Cross to Gaia at golden hour for the view back.',
    photo: photos.porto,
    experiences: [
      { title: 'Cellar tasting', meta: '2 hours · $30', photo: photos.porto },
      { title: 'Douro cruise', meta: 'Half day · $55', photo: photos.tulum },
    ],
  },
  {
    id: 'zermatt',
    name: 'Zermatt',
    country: 'Switzerland',
    region: 'Valais',
    category: 'mountains',
    rating: 4.9,
    reviews: 1988,
    priceFrom: 560,
    nights: 4,
    bestTime: 'Best Dec–Apr',
    priceBand: '€€€€',
    tags: ['Matterhorn', 'Glacier paradise', 'Car-free', 'Ski'],
    blurb:
      'A car-free village at the foot of the Matterhorn, with lifts that put you on a glacier before breakfast and back for fondue.',
    photo: photos.zermatt,
    experiences: [
      { title: 'Gornergrat railway', meta: 'Half day · $85', photo: photos.zermatt },
      { title: 'Five Lakes walk', meta: '3 hours · Free', photo: photos.dolomites },
    ],
  },
  {
    id: 'tulum',
    name: 'Tulum',
    country: 'Mexico',
    region: 'Quintana Roo',
    category: 'beaches',
    rating: 4.5,
    reviews: 1443,
    priceFrom: 480,
    nights: 5,
    bestTime: 'Best Nov–Apr',
    priceBand: '€€',
    tags: ['Cenotes', 'Mayan ruins', 'Reef', 'Beach clubs'],
    blurb:
      'Caribbean water the colour of a swimming pool, cenotes in the jungle behind it, and a clifftop ruin looking out over the reef.',
    photo: photos.tulum,
    experiences: [
      { title: 'Gran Cenote', meta: 'Half day · $25', photo: photos.tulum },
      { title: 'Tulum ruins', meta: '2 hours · $6', photo: photos.bali },
    ],
  },
];

export const destinationsById: Record<string, Destination> = Object.fromEntries(
  destinations.map((d) => [d.id, d]),
);

export const popularIds = ['santorini', 'kyoto', 'bali'];
export const weekendIds = ['lago-di-braies', 'porto', 'zermatt', 'tulum'];

export const categories: { id: 'all' | Category; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'beaches', label: 'Beaches' },
  { id: 'mountains', label: 'Mountains' },
  { id: 'cities', label: 'Cities' },
  { id: 'islands', label: 'Islands' },
];
