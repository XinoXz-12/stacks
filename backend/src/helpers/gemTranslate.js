import https from 'https';
import dotenv from 'dotenv';

dotenv.config();

const GEM_API_KEY = process.env.GEM_API_KEY;

export async function translate(textToTranslate) {
    if (!textToTranslate) {
        throw new Error("No se proporcionó texto para la traducción.");
    }

    const prompt = "Traduce este texto al español como un gamer, manteniendo una jerga informal. Mantén la estructura:\n" + textToTranslate;

    const postData = JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
    });

    const options = {
        hostname: 'generativelanguage.googleapis.com',
        port: 443,
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${GEM_API_KEY}`, 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        },
        rejectUnauthorized: false
    };

    return new Promise((resolve, reject) => {
        const apiReq = https.request(options, (apiRes) => {
            let data = '';

            apiRes.on('data', (chunk) => {
                data += chunk;
            });

            apiRes.on('end', () => {
                try {
                    const responseData = JSON.parse(data);
                    const aiResponse = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (aiResponse) {
                        resolve(aiResponse);
                    } else {
                        reject(new Error('La IA no pudo generar una traducción válida. Respuesta: ' + JSON.stringify(responseData)));
                    }
                } catch (parseError) {
                    reject(new Error('Error al parsear la respuesta JSON de la IA: ' + parseError.message));
                }
            });
        });

        apiReq.on('error', (e) => {
            reject(new Error('Error de red al comunicarse con la API de Google: ' + e.message));
        });

        apiReq.write(postData);
        apiReq.end();
    });
}

export default translate;