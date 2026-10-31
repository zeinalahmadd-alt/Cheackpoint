const proxy = 'https://proxy.cors.dev/';

const popularGameIds = [
    1091500, // Cyberpunk 2077
    292030,  // The Witcher 3
    1174180, // Red Dead Redemption 2
    1245620, // Elden Ring
    1086940, // Baldur's Gate 3
    1091500, // Cyberpunk 2077
    271590,  // GTA V
    990080,  // Hogwarts Legacy
    1145360, // Hades
    413150,  // Stardew Valley
    620,     // Portal 2
    400,     // Portal
    570,     // Dota 2
    730,     // Counter-Strike 2
    440,     // Team Fortress 2
    252490,  // Rust
    359550,  // Rainbow Six Siege
    1172470, // Apex Legends
    578080,  // PUBG
    230410,  // Warframe
    1085660, // Destiny 2
    255710,  // Cities: Skylines
    289070,  // Civilization VI
    489830,  // Skyrim Special Edition
    377160,  // Fallout 4
    374320,  // Dark Souls III
    292730,  // Call of Duty: Infinite Warfare
    1593500, // God of War
    1817070, // Marvel's Spider-Man Remastered
    1938090, // Call of Duty HQ
];

export async function getPopularGames() {
    const ids = [...new Set(popularGameIds)];

    const results = await Promise.all(
        ids.map(async (id) => {
            const url =
                `https://store.steampowered.com/api/appdetails?appids=${id}&cc=us&l=english&filters=basic`;

            try {
                const response = await fetch(proxy + url);

                if (!response.ok) {
                    console.warn(`Failed to load game ${id}:`, response.status);
                    return null;
                }

                const data = await response.json();
                const result = data[id];

                if (!result?.success || result.data?.type !== 'game') {
                    return null;
                }

                return {
                    id: result.data.steam_appid,
                    title: result.data.name,
                    cover: result.data.header_image,
                    genre: result.data.genres?.[0]?.description ?? 'Game',
                    status: null,
                };
            } catch (err) {
                console.warn(`Error loading game ${id}:`, err);
                return null;
            }
        })
    );

    return results.filter(Boolean);
}
export async function getGameDetails(id) {
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) {
        return null;
    }

    const url =
        `https://store.steampowered.com/api/appdetails?appids=${numericId}&cc=us&l=english&filters=basic`;

    const response = await fetch(proxy + url);

    if (!response.ok) {
        throw new Error('Failed to load game details');
    }

    const data = await response.json();
    const result = data?.[numericId];

    if (!result?.success || result.data?.type !== 'game') {
        return null;
    }

    const details = result.data;

    const description = (details.short_description || details.detailed_description || '')
        .replace(/<[^>]*>/g, '')
        .trim();

    return {
        id: details.steam_appid,
        title: details.name ?? 'Unknown game',
        cover: details.header_image ?? '',
        genre: details.genres?.[0]?.description ?? 'Game',
        description,
        releaseDate: details.release_date?.date ?? '',
        developer: details.developers?.[0] ?? '',
        publisher: details.publishers?.[0] ?? '',
        genres: Array.isArray(details.genres)
            ? details.genres.map((g) => g.description).filter(Boolean)
            : [],
    };
}

export async function searchGames(query) {
    const targetUrl =
        `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&l=english&cc=US`;

    const response = await fetch(proxy + targetUrl);

    if (!response.ok) {
        throw new Error('Failed to search Steam games');
    }

    const data = await response.json();
    const items = Array.isArray(data?.items) ? data.items : [];

    return items
        .filter((item) => item && item.id != null)
        .map((item) => ({
            id: item.id,
            title: item.name ?? 'Unknown game',
            cover: item.tiny_image ?? '',
            genre: 'Game',
            description: '',
            releaseDate: '',
            developer: '',
            publisher: '',
            genres: [],
        }));
}

