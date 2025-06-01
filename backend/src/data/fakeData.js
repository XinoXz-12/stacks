import { MongoClient } from 'mongodb';

async function fakeData() {
    const uri = process.env.MONGODB_URI || 'mongodb://root:example@mongo:27017/stacks?authSource=admin';
    const client = new MongoClient(uri);

    // Function to generate fake ObjectIds and dates
    const makeObjectId = (i) => `ObjectId("666f${String(i).padStart(6, '0')}")`;
    const makeDate = () => `ISODate("${new Date().toISOString()}")`;

    try {
        await client.connect();
        const db = client.db();

        const usersCount = await db.collection('users').countDocuments();
        if (usersCount > 0) {
            console.log("FakeData ya insertada.");
            return;
        }

        console.log("Insertando datos de prueba...");

        // USERS
        const users = Array.from({ length: 10 }).map((_, i) => ({
            _id: eval(makeObjectId(i)),
            username: `User${i}`,
            email: `user${i}@mail.com`,
            password: "123456",
            age: 18 + i,
            gender: i % 2 === 0 ? "M" : "F",
            image: `/uploads/avatar${i}.png`,
            role: "user"
        }));

        // PROFILES
        const profiles = Array.from({ length: 10 }).map((_, i) => ({
            _id: eval(makeObjectId(i + 100)),
            user_id: users[i]._id,
            game: ["Valorant", "Overwatch", "LoL"][i % 3],
            user_game: `GameUser${i}#TAG`,
            rank: ["Iron", "Bronze", "Silver", "Gold", "Radiant", "Top 500"][i % 6],
            subrank: (i % 3) + 1,
            style: i % 2 === 0 ? "casual" : "competitive",
            server: ["EU", "NA", "BR"][i % 3]
        }));

        // TEAMS
        const teams = Array.from({ length: 10 }).map((_, i) => ({
            _id: eval(makeObjectId(i + 200)),
            name: `Team${i}`,
            game: profiles[i].game,
            gender: "Mixto",
            capacity: 5,
            members: [
                profiles[i]._id,
                profiles[(i + 1) % profiles.length]._id
            ]
        }));

        // REQUESTS
        const requests = Array.from({ length: 10 }).map((_, i) => ({
            _id: eval(makeObjectId(i + 300)),
            team_id: teams[i % teams.length]._id,
            profile_id: profiles[(i + 2) % profiles.length]._id,
            status: "accepted",
            date_joined: eval(makeDate())
        }));

        // MESSAGES
        const messages = Array.from({ length: 10 }).map((_, i) => ({
            _id: eval(makeObjectId(i + 400)),
            teamId: teams[i % teams.length]._id,
            senderId: profiles[(i + 1) % profiles.length]._id,
            content: `Mensaje de prueba ${i}`,
            date: eval(makeDate())
        }));

        await db.collection('users').insertMany(users);
        await db.collection('profiles').insertMany(profiles);
        await db.collection('teams').insertMany(teams);
        await db.collection('requests').insertMany(requests);
        await db.collection('messages').insertMany(messages);

        console.log("Datos insertados.");
    } catch (err) {
        console.error("Error en el script de fakeData:", err);
    } finally {
        await client.close();
    }
}

export default fakeData;
