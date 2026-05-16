import { FriendshipStatus, PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

// Unsplash images (direct photo URLs, reliably accessible)
const IMAGES = {
  jazz: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop",
  techMeetup: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop",
  beachParty: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop",
  artGallery: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop",
  foodFest: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop",
  clubNight: "https://images.unsplash.com/photo-1571266028563-d0eae0f6edd2?w=800&auto=format&fit=crop",
  yoga: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop",
  cinema: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop",
  standup: "https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800&auto=format&fit=crop",
  boat: "https://images.unsplash.com/photo-1468581264429-2548ef9eb732?w=800&auto=format&fit=crop",
  // User avatars
  avatar1: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop",
  avatar2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop",
  avatar3: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop",
  avatar4: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop",
  // Business logos/covers
  venueImg: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=400&auto=format&fit=crop",
  galleryImg: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=400&auto=format&fit=crop",
  techHubImg: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop",
};

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.event_interest.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.event.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification_token.deleteMany();
  await prisma.user.deleteMany();

  // ── Users ──────────────────────────────────────────────────────────────────

  const admin = await prisma.user.create({
    data: {
      email: "admin@navun.bg",
      name: "Навън Admin",
      username: "navun_admin",
      role: Role.ADMIN,
      email_verified: new Date(),
    },
  });

  const venue = await prisma.user.create({
    data: {
      email: "seagarden@navun.bg",
      name: "Морска Градина",
      username: "morska_gradina",
      role: Role.BUSINESS,
      is_approved: true,
      email_verified: new Date(),
      image: IMAGES.venueImg,
    },
  });

  const gallery = await prisma.user.create({
    data: {
      email: "gallery@navun.bg",
      name: "Арт Галерия Варна",
      username: "art_gallery_varna",
      role: Role.BUSINESS,
      is_approved: true,
      email_verified: new Date(),
      image: IMAGES.galleryImg,
    },
  });

  const techHub = await prisma.user.create({
    data: {
      email: "techhub@navun.bg",
      name: "Варна Тех Хъб",
      username: "varna_tech_hub",
      role: Role.BUSINESS,
      is_approved: true,
      email_verified: new Date(),
      image: IMAGES.techHubImg,
    },
  });

  const pendingBusiness = await prisma.user.create({
    data: {
      email: "newclub@navun.bg",
      name: "Нов Клуб",
      username: "nov_klub",
      role: Role.BUSINESS,
      is_approved: false,
      email_verified: new Date(),
    },
  });

  const alice = await prisma.user.create({
    data: {
      email: "alice@example.com",
      name: "Алис Петрова",
      username: "alice_p",
      role: Role.USER,
      email_verified: new Date(),
      image: IMAGES.avatar1,
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: "bob@example.com",
      name: "Боян Димитров",
      username: "boyan_d",
      role: Role.USER,
      email_verified: new Date(),
      image: IMAGES.avatar2,
    },
  });

  const maya = await prisma.user.create({
    data: {
      email: "maya@example.com",
      name: "Мая Иванова",
      username: "maya_iv",
      role: Role.USER,
      email_verified: new Date(),
      image: IMAGES.avatar3,
    },
  });

  const stefan = await prisma.user.create({
    data: {
      email: "stefan@example.com",
      name: "Стефан Георгиев",
      username: "stefan_g",
      role: Role.USER,
      email_verified: new Date(),
      image: IMAGES.avatar4,
    },
  });

  // ── Events (all in Varna) ──────────────────────────────────────────────────

  const now = new Date();
  const d = (days: number, hour = 20) => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    date.setHours(hour, 0, 0, 0);
    return date;
  };

  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: "Джаз вечер в Морска Градина",
        description: "Незабравима джаз вечер с живо изпълнение на открито в сърцето на Морска Градина. Насладете се на морския бриз и вълшебната музика.",
        location: "Морска Градина, Варна",
        lat: 43.2057,
        lng: 27.9166,
        starts_at: d(3),
        ends_at: d(3, 23),
        category: "music",
        is_published: true,
        image_url: IMAGES.jazz,
        business_id: venue.id,
      },
    }),
    prisma.event.create({
      data: {
        title: "Варна Тех Среща — AI & Web3",
        description: "Месечната среща на варненската tech общност. Теми: практически AI инструменти и децентрализирани приложения. Нетуъркинг след събитието.",
        location: "Варна Тех Хъб, бул. Осми Приморски полк 43",
        lat: 43.2104,
        lng: 27.9142,
        starts_at: d(5, 18),
        ends_at: d(5, 21),
        category: "tech",
        is_published: true,
        image_url: IMAGES.techMeetup,
        business_id: techHub.id,
      },
    }),
    prisma.event.create({
      data: {
        title: "Beach Party — Черно море",
        description: "Епичен Beach party на плажа. DJ сет, напитки, танци и залез над Черно море. Dress code: бяло.",
        location: "Централен плаж, Варна",
        lat: 43.1958,
        lng: 27.9236,
        starts_at: d(7, 21),
        ends_at: d(8, 4),
        category: "party",
        is_published: true,
        image_url: IMAGES.beachParty,
        business_id: venue.id,
      },
    }),
    prisma.event.create({
      data: {
        title: "Изложба: Черно море в изкуството",
        description: "Съвременна изложба на варненски художници, вдъхновени от Черно море. 23 художника, над 80 творби.",
        location: "Арт Галерия Варна, ул. Любен Каравелов 5",
        lat: 43.2043,
        lng: 27.9168,
        starts_at: d(1, 10),
        ends_at: d(14, 18),
        category: "art",
        is_published: true,
        image_url: IMAGES.artGallery,
        business_id: gallery.id,
      },
    }),
    prisma.event.create({
      data: {
        title: "Фестивал на морската кухня",
        description: "Два дни с най-добрите ресторанти на Варна. Дегустации, кулинарни демонстрации и конкурс за най-добра рибена чорба.",
        location: "Пристанище Варна",
        lat: 43.1991,
        lng: 27.9132,
        starts_at: d(10, 12),
        ends_at: d(11, 20),
        category: "food",
        is_published: true,
        image_url: IMAGES.foodFest,
        business_id: venue.id,
      },
    }),
    prisma.event.create({
      data: {
        title: "Stand-up Comedy Night",
        description: "Най-добрите стендъп комици в България на сцена в Морска Градина. Смях, забавление и слънчев залез.",
        location: "Летен театър, Морска Градина",
        lat: 43.2074,
        lng: 27.9152,
        starts_at: d(6, 20),
        ends_at: d(6, 22),
        category: "other",
        is_published: true,
        image_url: IMAGES.standup,
        business_id: venue.id,
      },
    }),
    prisma.event.create({
      data: {
        title: "Sunrise Yoga на плажа",
        description: "Започнете деня с йога практика на централния плаж при изгрев слънце. За всички нива. Носете постелка.",
        location: "Централен плаж, Варна",
        lat: 43.1955,
        lng: 27.9240,
        starts_at: d(2, 7),
        ends_at: d(2, 9),
        category: "sport",
        is_published: true,
        image_url: IMAGES.yoga,
        business_id: venue.id,
      },
    }),
    prisma.event.create({
      data: {
        title: "Кино под звездите",
        description: "Открито кино в Морска Градина. Тази вечер: класически европейски филми с субтитри. Носете одеяло.",
        location: "Морска Градина, Варна",
        lat: 43.2061,
        lng: 27.9170,
        starts_at: d(4, 21),
        ends_at: d(4, 23),
        category: "other",
        is_published: true,
        image_url: IMAGES.cinema,
        business_id: gallery.id,
      },
    }),
    prisma.event.create({
      data: {
        title: "Club Night — Deep House",
        description: "Цяла нощ Deep House с международен DJ гост. Лимитирани билети.",
        location: "Клуб X, к.к. Златни Пясъци",
        lat: 43.2833,
        lng: 28.0167,
        starts_at: d(8, 23),
        ends_at: d(9, 5),
        category: "party",
        is_published: true,
        image_url: IMAGES.clubNight,
        business_id: venue.id,
      },
    }),
    prisma.event.create({
      data: {
        title: "Круиз по залез — Черно море",
        description: "2-часов романтичен круиз по залез с яхта. Шампанско включено. Максимум 20 човека.",
        location: "Яхтено пристанище, Варна",
        lat: 43.1980,
        lng: 27.9120,
        starts_at: d(9, 19),
        ends_at: d(9, 21),
        category: "other",
        is_published: true,
        image_url: IMAGES.boat,
        business_id: venue.id,
      },
    }),
  ]);

  // ── Interests ──────────────────────────────────────────────────────────────

  await prisma.event_interest.createMany({
    data: [
      { user_id: alice.id, event_id: events[0].id },
      { user_id: bob.id, event_id: events[0].id },
      { user_id: maya.id, event_id: events[0].id },
      { user_id: alice.id, event_id: events[1].id },
      { user_id: stefan.id, event_id: events[1].id },
      { user_id: bob.id, event_id: events[2].id },
      { user_id: maya.id, event_id: events[2].id },
      { user_id: stefan.id, event_id: events[2].id },
      { user_id: alice.id, event_id: events[3].id },
      { user_id: maya.id, event_id: events[4].id },
      { user_id: bob.id, event_id: events[5].id },
      { user_id: stefan.id, event_id: events[6].id },
      { user_id: alice.id, event_id: events[7].id },
      { user_id: bob.id, event_id: events[8].id },
      { user_id: maya.id, event_id: events[9].id },
    ],
  });

  // ── Friendships ────────────────────────────────────────────────────────────

  await prisma.friendship.createMany({
    data: [
      { requester_id: alice.id, addressee_id: bob.id, status: FriendshipStatus.ACCEPTED },
      { requester_id: alice.id, addressee_id: maya.id, status: FriendshipStatus.ACCEPTED },
      { requester_id: bob.id, addressee_id: stefan.id, status: FriendshipStatus.ACCEPTED },
      { requester_id: maya.id, addressee_id: stefan.id, status: FriendshipStatus.PENDING },
    ],
  });

  console.log("✅ Seed complete:");
  console.log(`  Users: ${await prisma.user.count()}`);
  console.log(`  Events: ${await prisma.event.count()}`);
  console.log(`  Interests: ${await prisma.event_interest.count()}`);
  console.log(`  Friendships: ${await prisma.friendship.count()}`);
  console.log(`\n  Credentials to use:`);
  console.log(`  Admin:    admin@navun.bg`);
  console.log(`  Business: seagarden@navun.bg`);
  console.log(`  User:     alice@example.com`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
