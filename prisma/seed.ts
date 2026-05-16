import { FriendshipStatus, PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.event_interest.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.event.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification_token.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const admin = await prisma.user.create({
    data: {
      email: "admin@navun.bg",
      name: "Admin User",
      username: "admin",
      role: Role.ADMIN,
      email_verified: new Date(),
    },
  });

  const business = await prisma.user.create({
    data: {
      email: "business@navun.bg",
      name: "Cool Venue",
      username: "cool_venue",
      role: Role.BUSINESS,
      is_approved: true,
      email_verified: new Date(),
    },
  });

  const user1 = await prisma.user.create({
    data: {
      email: "alice@example.com",
      name: "Alice",
      username: "alice",
      role: Role.USER,
      email_verified: new Date(),
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "bob@example.com",
      name: "Bob",
      username: "bob",
      role: Role.USER,
      email_verified: new Date(),
    },
  });

  // Create events
  const event1 = await prisma.event.create({
    data: {
      title: "Friday Night Jazz",
      description: "Live jazz performance at Cool Venue",
      location: "Sofia, Bulgaria",
      lat: 42.6977,
      lng: 23.3219,
      starts_at: new Date("2026-06-01T20:00:00Z"),
      ends_at: new Date("2026-06-01T23:00:00Z"),
      category: "music",
      is_published: true,
      business_id: business.id,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: "Tech Meetup",
      description: "Monthly developer meetup",
      location: "Plovdiv, Bulgaria",
      lat: 42.1354,
      lng: 24.7453,
      starts_at: new Date("2026-06-15T18:00:00Z"),
      ends_at: new Date("2026-06-15T21:00:00Z"),
      category: "tech",
      is_published: true,
      business_id: business.id,
    },
  });

  // Create event interests
  await prisma.event_interest.createMany({
    data: [
      { user_id: user1.id, event_id: event1.id },
      { user_id: user2.id, event_id: event1.id },
      { user_id: user1.id, event_id: event2.id },
    ],
  });

  // Create friendships
  await prisma.friendship.create({
    data: {
      requester_id: user1.id,
      addressee_id: user2.id,
      status: FriendshipStatus.ACCEPTED,
    },
  });

  await prisma.friendship.create({
    data: {
      requester_id: user2.id,
      addressee_id: admin.id,
      status: FriendshipStatus.PENDING,
    },
  });

  console.log("Seed complete:");
  console.log(`  Users: ${await prisma.user.count()}`);
  console.log(`  Events: ${await prisma.event.count()}`);
  console.log(`  Interests: ${await prisma.event_interest.count()}`);
  console.log(`  Friendships: ${await prisma.friendship.count()}`);
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
