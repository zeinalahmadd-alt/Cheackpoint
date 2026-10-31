import { reactive, watch, ref } from 'vue';

// Normalize a user game record so every saved game has a consistent shape.
// Existing personal data is preserved; only missing fields receive defaults.
function normalizeUserGame(game) {
    const g = game && typeof game === 'object' ? game : {};

    return {
        id: g.id,
        title: g.title ?? '',
        cover: g.cover ?? '',
        genre: g.genre ?? 'Game',
        description: g.description ?? '',
        releaseDate: g.releaseDate ?? g.release_date ?? '',
        developer: g.developer ?? '',
        publisher: g.publisher ?? '',
        genres: Array.isArray(g.genres)
            ? g.genres
            : (g.genres ? [g.genres] : []),
        inLibrary: !!g.inLibrary,
        fav: !!g.fav,
        status: g.status ?? null,
        rating: typeof g.rating === 'number'
            ? g.rating
            : (g.rating != null && g.rating !== '' ? Number(g.rating) || 0 : 0),
        notes: g.notes ?? '',
    };
}

// Safely read the persisted user collection from LocalStorage.
function loadUserGames() {
    try {
        const raw = localStorage.getItem('userGames');
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.map(normalizeUserGame);
    } catch (err) {
        console.warn('Failed to parse userGames from localStorage:', err);
        return [];
    }
}

// User Games (personal collection)
const savedGames = loadUserGames();

export const userGames = reactive(savedGames);

// Steam Games (discovery: popular/recommended)
export const steamGames = reactive([]);

// Steam Search Results
export const searchResults = reactive([]);

// Popular Games Loading State
export const popularGamesLoaded = ref(false);
export const popularGamesLoading = ref(false);

// LocalStorage Persistence
watch(
    userGames,
    (newGames) => {
        try {
            localStorage.setItem('userGames', JSON.stringify(newGames));
        } catch (err) {
            console.warn('Failed to save userGames to localStorage:', err);
        }
    },
    { deep: true }
);

// Add or update a game in the user collection using its Steam App ID.
// Steam fields are refreshed, but personal data (rating, notes, fav,
// inLibrary, status) is preserved when the record already exists.
export function upsertUserGame(steamGame) {
    if (!steamGame || steamGame.id == null) {
        return null;
    }

    const existing = userGames.find((game) => game.id === steamGame.id);

    if (existing) {
        if (steamGame.title != null) existing.title = steamGame.title;
        if (steamGame.cover != null) existing.cover = steamGame.cover;
        if (steamGame.genre != null) existing.genre = steamGame.genre;
        if (steamGame.description != null) existing.description = steamGame.description;
        if (steamGame.releaseDate != null) existing.releaseDate = steamGame.releaseDate;
        if (steamGame.release_date != null) existing.releaseDate = steamGame.release_date;
        if (steamGame.developer != null) existing.developer = steamGame.developer;
        if (steamGame.publisher != null) existing.publisher = steamGame.publisher;
        if (Array.isArray(steamGame.genres)) existing.genres = steamGame.genres;

        // Fill any missing fields without overwriting personal data.
        const normalized = normalizeUserGame(existing);
        Object.assign(existing, normalized);

        return existing;
    }

    const record = normalizeUserGame({
        ...steamGame,
        inLibrary: steamGame.inLibrary ?? false,
        fav: steamGame.fav ?? false,
        status: steamGame.status ?? null,
        rating: steamGame.rating ?? 0,
        notes: steamGame.notes ?? '',
    });

    userGames.push(record);
    return record;
}

// Remove a user game only when it is neither in the library nor a favorite.
// Returns true when a record was removed.
export function removeUserGameIfOrphan(id) {
    const index = userGames.findIndex((game) => game.id === id);
    if (index === -1) {
        return false;
    }

    const game = userGames[index];
    if (game.inLibrary || game.fav) {
        return false;
    }

    userGames.splice(index, 1);
    return true;
}
