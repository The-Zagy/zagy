export prisma from './prisma-client';

async function main() {
    const user = await prisma.user.create({
        data: {
            name: "the-zagy",
            role: "admin",
        },
    });
    console.dir(user, { depth: null });
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
