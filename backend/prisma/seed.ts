import { prisma } from "../src/lib/prisma.js";
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

async function main() {
    console.log("🌱 Starting seeding...");

    // 1. Create Departments
    const departmentNames = ["General Medicine", "Pediatrics", "Surgery", "Emergency", "Cardiology"];
    const departments = await Promise.all(
        departmentNames.map(name =>
            prisma.department.upsert({
                where: { name },
                update: {},
                create: { name },
            })
        )
    );
    console.log(`✅ Created ${departments.length} departments.`);

    // 2. Create Users & Profiles
    const userData = [
        { email: "josiah.akorli@meditrack.gh", firstName: "Josiah", middleName: "Mawulorm", lastName: "Akorli", staffId: 8989123 },
        { email: "kelvin.obeng@meditrack.gh", firstName: "Kelvin", middleName: "Ofosu", lastName: "Obeng", staffId: 9031823 },
        { email: "dennis.konde@meditrack.gh", firstName: "Dennis", middleName: "Dawuni", lastName: "Konde", staffId: 9023223 },
        { email: "kelvin.anaba@meditrack.gh", firstName: "Kelvin", middleName: "Ayinedenaba", lastName: "Anaba", staffId: 8995023 },
        { email: "kwame.biney@meditrack.gh", firstName: "Kwame", middleName: "Akyea", lastName: "Biney", staffId: 9009323 },
        { email: "nana.hwedie@meditrack.gh", firstName: "Nana Kweku", middleName: "Osei", lastName: "Hwedie", staffId: 9021823 },
        { email: "haruna.nuhu@meditrack.gh", firstName: "Haruna", middleName: null, lastName: "Nuhu", staffId: 9030323 },
        { email: "genevieve.oppong@meditrack.gh", firstName: "Genevieve", middleName: "Gyabaa", lastName: "Oppong", staffId: 9035723 },
        { email: "sandra.eshun@meditrack.gh", firstName: "Sandra", middleName: null, lastName: "Eshun", staffId: 9018123 },
        { email: "michael.yeboah@meditrack.gh", firstName: "Michael", middleName: "Kweku", lastName: "Yeboah", staffId: 9048123 },
    ];

    const users = await Promise.all(
        userData.map(async (u, index) => {
            // Cycle through available departments
            const dept = departments[index % departments.length];
            return prisma.user.upsert({
                where: { email: u.email },
                update: {},
                create: {
                    email: u.email,
                    password: bcrypt.hashSync("password123", 10),
                    profile: {
                        create: {
                            staffId: BigInt(u.staffId),
                            firstName: u.firstName,
                            middleName: u.middleName,
                            lastName: u.lastName,
                            departmentId: dept.id,
                            theme: index % 2 === 0 ? "light" : "dark",
                            language: "english",
                        },
                    },
                },
            });
        })
    );
    console.log(`✅ Created ${users.length} users/profiles.`);

    // 3. Generate Fake Patients
    console.log("⏳ Generating patient data...");
    const genders = ["Male", "Female", "Other"];
    const bloodTypes = ["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE"];
    const statuses = ["Active", "Inactive"];

    for (const user of users) {
        // Generate 20 patients per doctor
        const patientPromises = Array.from({ length: 20 }).map(() => {
            const gender = faker.helpers.arrayElement(genders);
            const firstName = faker.person.firstName(gender.toLowerCase() as any);
            const surname = faker.person.lastName();

            return prisma.patient.create({
                data: {
                    firstName,
                    surname,
                    otherNames: faker.person.middleName(),
                    dob: faker.date.birthdate({ min: 0, max: 90, mode: 'age' }),
                    gender: gender as any,
                    bloodType: faker.helpers.arrayElement(bloodTypes) as any,
                    admissionDate: faker.date.recent({ days: 30 }),
                    status: faker.helpers.arrayElement(statuses) as any,
                    address: `${faker.location.streetAddress()}, ${faker.location.city()}`,
                    contact: faker.phone.number({ style: 'international' }).substring(0, 15),
                    ghanaCard: `GHA-${faker.string.numeric(12)}`,
                    emergencyContact1: faker.phone.number({ style: 'international' }).substring(0, 15),
                    emergencyContact2: faker.phone.number({ style: 'international' }).substring(0, 15),
                    doctorId: user.id,
                },
            });
        });

        await Promise.all(patientPromises);
        console.log(`✅ Created 20 patients for ${user.email}`);
    }

    // 4. Generate Notifications
    console.log("⏳ Generating notifications...");
    const notificationTitles = [
        "System Maintenance: Scheduled for Saturday",
        "New Policy Update: Patient Privacy",
        "Staff Meeting: Monday at 9 AM",
        "Inventory Alert: Surgical Masks Low",
        "Training Session: New Ventilator Operation",
    ];

    for (const title of notificationTitles) {
        await prisma.notification.upsert({
            where: { id: title }, // Using title as a temporary key if id was title, or just use findFirst
            update: {},
            create: {
                title,
                message: faker.lorem.paragraph().substring(0, 255),
            },
        }).catch(async () => {
             // If title is not unique in 'where', fallback to check and create
             const exists = await prisma.notification.findFirst({ where: { title } });
             if (!exists) {
                 await prisma.notification.create({
                     data: {
                         title,
                         message: faker.lorem.paragraph().substring(0, 255),
                     },
                 });
             }
        });
    }
    console.log(`✅ Notification seeding processed.`);

    console.log("✨ Seeding finished successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:");
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
