import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

async function fakeData() {
    const uri = process.env.MONGODB_URI || 'mongodb://root:example@mongo:27017/stacks?authSource=admin';
    const client = new MongoClient(uri);

    // Generate random ObjectId and Date
    const makeObjectId = () => new ObjectId();
    const makeDate = () => new Date();

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
        const users = Array.from({ length: 10 }).map(async (_, i) => ({
            _id: makeObjectId(),
            username: `User${i}`,
            email: `user${i}@mail.com`,
            password: await bcrypt.hash("123456", 8),
            age: 18 + i,
            gender: i % 2 === 0 ? "M" : "F",
            image: `/uploads/avatar${i}.png`,
            role: "user"
        }));

        // PROFILES
        const profiles = users.map((user, i) => ({
            _id: makeObjectId(),
            user_id: user._id,
            game: ["Valorant", "Overwatch", "LoL"][i % 3],
            user_game: `GameUser${i}#TAG`,
            rank: ["Iron", "Bronze", "Silver", "Gold", "Radiant", "Top 500"][i % 6],
            subrank: (i % 3) + 1,
            style: i % 2 === 0 ? "casual" : "competitive",
            server: ["EU", "NA", "BR"][i % 3]
        }));

        // TEAMS
        const teams = profiles.map((profile, i) => ({
            _id: makeObjectId(),
            name: `Team${i}`,
            game: profile.game,
            gender: "Mixto",
            capacity: 5,
            members: [
                profile._id,
                profiles[(i + 1) % profiles.length]._id
            ]
        }));

        // REQUESTS
        const requests = profiles.map((profile, i) => ({
            _id: makeObjectId(),
            team_id: teams[i % teams.length]._id,
            profile_id: profiles[(i + 2) % profiles.length]._id,
            status: "accepted",
            date_joined: makeDate()
        }));

        // MESSAGES
        const messages = profiles.map((profile, i) => ({
            _id: makeObjectId(),
            teamId: teams[i % teams.length]._id,
            senderId: profiles[(i + 1) % profiles.length]._id,
            content: `Mensaje de prueba ${i}`,
            date: makeDate()
        }));

        await db.collection('users').insertMany(users);
        await db.collection('profiles').insertMany(profiles);
        await db.collection('teams').insertMany(teams);
        await db.collection('requests').insertMany(requests);
        await db.collection('messages').insertMany(messages);

        console.log("Datos insertados correctamente.");
    } catch (err) {
        console.error("Error en el script de fakeData:", err);
    } finally {
        await client.close();
    }
}

export default fakeData;
