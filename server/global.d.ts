interface PgOptions {
    username: string;
    password: string;
}

interface PerkSet {
    perk0Id: number;
    perk1Id: number;
    perk2Id: number;
    perk3Id: number;
    perk4Id: number;
    perk5Id: number;
    championId: number;
    matchId: number;
    win: boolean;
}

interface PerkMap {
    [perkId: number]: PerkFrequency;
}

interface PerkFrequency {
    /** Perk ID */
    id: number;
    data: { [perkId: number]: PairingFrequency; }
}

interface PairingFrequency {
    /** Number of times this combination is used */
    count: number;
    /** Number of wins when this combination is used */
    wins: number;
    /** Number of times each champion is used with this combination. Should sum up to equal the count property. */
    champions: { [championId: number]: ChampionFrequency; };
}

interface ChampionFrequency {
    /** Number of times this combination is used */
    count: number;
    /** Number of wins when this combination is used */
    wins: number;
}

interface MatchRecord {
    id: number;
    data: any;
}

interface SeedData {
    matches: any[];
}

interface RuneTree {
    name: string;
    perkStyleId: number;
    runes: Rune[][];
}

interface Rune {
    id: number;
    name: string;
    description: string;
    keystone?: boolean;
}
