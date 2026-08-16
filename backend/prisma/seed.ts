import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, ProductAvailability } from '../src/generated/prisma';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL }),
});

const image = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

const products = [
  {
    slug: 'nike-air-max-270',
    name: 'Nike Air Max 270',
    description:
      'The Air Max 270 pairs the tallest Air unit Nike has ever put in a lifestyle shoe with a stretchy bootie upper. Sourced from an authorised US retailer and consolidated at our New Jersey hub before shipping to Nigeria.',
    priceCents: 12_000,
    category: 'Footwear',
    imageUrl: image(5560288),
    availability: ProductAvailability.IN_STOCK,
    stockQuantity: 42,
    deliveryMinDays: 7,
    deliveryMaxDays: 14,
    rating: 4.6,
    ratingCount: 1284,
  },
  {
    slug: 'apple-airpods-pro-2',
    name: 'Apple AirPods Pro (2nd Generation)',
    description:
      'Up to 2x more Active Noise Cancellation than the previous generation, Adaptive Transparency and Personalised Spatial Audio. Ships with the MagSafe charging case and a full international warranty.',
    priceCents: 24_900,
    category: 'Audio',
    imageUrl: image(3081173),
    availability: ProductAvailability.IN_STOCK,
    stockQuantity: 30,
    deliveryMinDays: 7,
    deliveryMaxDays: 14,
    rating: 4.8,
    ratingCount: 3417,
  },
  {
    slug: 'samsung-galaxy-watch-6-classic',
    name: 'Samsung Galaxy Watch 6 Classic',
    description:
      'A 47mm stainless steel case with the returning rotating bezel, advanced sleep coaching and body composition tracking. Limited units are held at our consolidation hub, so delivery runs slightly longer.',
    priceCents: 19_900,
    category: 'Wearables',
    imageUrl: image(31406895),
    availability: ProductAvailability.LIMITED_STOCK,
    stockQuantity: 6,
    deliveryMinDays: 10,
    deliveryMaxDays: 18,
    rating: 4.4,
    ratingCount: 862,
  },
  {
    slug: 'sony-wh-1000xm5',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description:
      'Eight microphones and two processors deliver the best noise cancellation Sony has shipped, with 30 hours of battery life and precise hands-free calling. Includes the folding carry case.',
    priceCents: 34_800,
    category: 'Audio',
    imageUrl: image(210927),
    availability: ProductAvailability.IN_STOCK,
    stockQuantity: 18,
    deliveryMinDays: 7,
    deliveryMaxDays: 14,
    rating: 4.7,
    ratingCount: 2189,
  },
  {
    slug: 'adidas-ultraboost-light',
    name: 'Adidas Ultraboost Light',
    description:
      'The lightest Ultraboost ever made, with Light BOOST midsole foam and a Primeknit+ upper that adapts to the shape of your foot. A daily trainer that holds up on long road runs.',
    priceCents: 18_000,
    category: 'Footwear',
    imageUrl: image(1027130),
    availability: ProductAvailability.IN_STOCK,
    stockQuantity: 25,
    deliveryMinDays: 9,
    deliveryMaxDays: 16,
    rating: 4.5,
    ratingCount: 977,
  },
  {
    slug: 'apple-macbook-air-m3-13',
    name: 'Apple MacBook Air 13" (M3, 16GB, 512GB)',
    description:
      'The M3 chip brings a faster Neural Engine and support for two external displays to the fanless MacBook Air. Configured with 16GB of unified memory and a 512GB SSD.',
    priceCents: 109_900,
    category: 'Computing',
    imageUrl: image(6893890),
    availability: ProductAvailability.LIMITED_STOCK,
    stockQuantity: 4,
    deliveryMinDays: 12,
    deliveryMaxDays: 21,
    rating: 4.9,
    ratingCount: 1546,
  },
  {
    slug: 'herschel-little-america-backpack',
    name: 'Herschel Little America Backpack 25L',
    description:
      'A mountaineering-inspired silhouette with a magnetic strap closure, a padded 15" laptop sleeve and a signature striped fabric liner. Built for daily commuting and carry-on travel.',
    priceCents: 8_999,
    category: 'Bags',
    imageUrl: image(701742),
    availability: ProductAvailability.IN_STOCK,
    stockQuantity: 60,
    deliveryMinDays: 7,
    deliveryMaxDays: 14,
    rating: 4.3,
    ratingCount: 640,
  },
  {
    slug: 'canon-eos-r50-mirrorless',
    name: 'Canon EOS R50 Mirrorless Camera Kit',
    description:
      'A 24.2MP APS-C sensor with Dual Pixel CMOS AF II, uncropped 4K video and subject-detection autofocus. Ships with the RF-S 18-45mm IS STM kit lens, battery and charger.',
    priceCents: 67_900,
    category: 'Cameras',
    imageUrl: image(26873540),
    availability: ProductAvailability.IN_STOCK,
    stockQuantity: 9,
    deliveryMinDays: 12,
    deliveryMaxDays: 21,
    rating: 4.6,
    ratingCount: 412,
  },
  {
    slug: 'jbl-tune-770nc',
    name: 'JBL Tune 770NC Wireless Headphones',
    description:
      'Adaptive noise cancelling with 70 hours of battery life and JBL Pure Bass sound. A comfortable over-ear fit that folds flat for travel, at a fraction of flagship pricing.',
    priceCents: 9_995,
    category: 'Audio',
    imageUrl: image(5650531),
    availability: ProductAvailability.IN_STOCK,
    stockQuantity: 44,
    deliveryMinDays: 7,
    deliveryMaxDays: 14,
    rating: 4.2,
    ratingCount: 1103,
  },
  {
    slug: 'garmin-forerunner-265',
    name: 'Garmin Forerunner 265 Running Watch',
    description:
      'A bright AMOLED display, training readiness scores and multi-band GPS in a 46g running watch. Currently sold out at source while we secure the next consolidation batch.',
    priceCents: 44_999,
    category: 'Wearables',
    imageUrl: image(18078946),
    availability: ProductAvailability.OUT_OF_STOCK,
    stockQuantity: 0,
    deliveryMinDays: 10,
    deliveryMaxDays: 18,
    rating: 4.7,
    ratingCount: 588,
  },
  {
    slug: 'logitech-mx-master-3s',
    name: 'Logitech MX Master 3S Wireless Mouse',
    description:
      'An 8K DPI sensor that tracks on glass, quiet clicks that are 90% less loud, and MagSpeed electromagnetic scrolling. Pairs with up to three devices over Bolt or Bluetooth.',
    priceCents: 9_999,
    category: 'Computing',
    imageUrl: image(3747070),
    availability: ProductAvailability.IN_STOCK,
    stockQuantity: 50,
    deliveryMinDays: 7,
    deliveryMaxDays: 14,
    rating: 4.8,
    ratingCount: 2740,
  },
  {
    slug: 'fujifilm-instax-mini-12',
    name: 'Fujifilm Instax Mini 12 Instant Camera',
    description:
      'Automatic exposure, a built-in close-up mode and prints that develop in about 90 seconds. Includes a twin pack of Instax Mini film to get started.',
    priceCents: 7_900,
    category: 'Cameras',
    imageUrl: image(6931586),
    availability: ProductAvailability.LIMITED_STOCK,
    stockQuantity: 5,
    deliveryMinDays: 9,
    deliveryMaxDays: 16,
    rating: 4.4,
    ratingCount: 1876,
  },
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      create: product,
      update: product,
    });
  }

  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
