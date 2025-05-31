import Parser from "rss-parser";
import {
    extractImageUrl,
    formatDate,
    stripHtml,
    errorResponse,
} from "../helpers/functions.js";
import { FEED_URLS } from "../helpers/enumsValid.js";
import { translate } from "../helpers/gemTranslate.js";

const parser = new Parser();

const translateText = async (text) => {
    if (!text) return null;
    try {
        // return await translate(text);
        return text;
    } catch (error) {
        console.error(
            "#NewsController# #translateText# Error traduciendo texto:",
            error.message
        );
        return text;
    }
};

// Obtener noticias de todos los juegos
const getAllNews = async (_req, res) => {
    console.log("GET /news");
    try {
        const allNews = [];

        for (const [game, url] of Object.entries(FEED_URLS)) {
            const feed = await parser.parseURL(url);
            const newsItems = feed.items.slice(0, 3);

            for (const item of newsItems) {
                const rawSummary =
                    item.description || item.contentSnippet || "";
                const summaryText = stripHtml(rawSummary);
                const imageUrl = extractImageUrl(
                    item.description || item.content || ""
                );

                const titleEs = item.title
                    ? await translateText(item.title)
                    : null;
                const summaryEs = summaryText
                    ? await translateText(summaryText)
                    : null;

                allNews.push({
                    title: titleEs,
                    summary: summaryEs,
                    link: item.link,
                    date: formatDate(item.pubDate),
                    rawDate: item.pubDate,
                    image: imageUrl,
                    game,
                });
            }
        }

        allNews.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));

        res.json({
            count: allNews.length,
            data: allNews.map(({ rawDate, ...rest }) => rest),
        });
    } catch (error) {
        errorResponse(
            res,
            "#NewsController# #getAllNews# Error al obtener noticias",
            500,
            error
        );
    }
};

export { getAllNews };
