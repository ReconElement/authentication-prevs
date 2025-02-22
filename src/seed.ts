import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function seed(){
    const user1 = await db.user.create({
        data: {
            id: 1,
            email: "omkarpanda895@gmail.com",
            name: "Omkar Panda",
            password: "password1",
            posts: {}
        }
    })

    const post1 = await db.post.create({
        data: {
            id: 1,
            title: "Just write code bro",
            content: "Yea, the secret to great success is to just focus on writing code, everything else will flow in line, it may take some additional time and effort, but when working on this principle you'll never get bored our be out of steam and can always not feel the grudging boredom of reading",
            authorId: 1
        }
    })
}

seed().then(async ()=>{
    await db.$disconnect();
})
.catch(async (err)=>{
    console.error(err);
    await db.$disconnect();
    process.exit(1);
});
