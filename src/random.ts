function generateRandomString(length: number, allowedCharacters: string): string {
    let result = "";
    const l = allowedCharacters.length;
    for (let i = 0; i < length; i++) {
        result += allowedCharacters.charAt(Math.floor(Math.random() * l));
    }
    return result;
}

export function generatePassword(length: number) {
    const characters = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
    return generateRandomString(length, characters);
}

export function generateUsername(length: number) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789_-.=/';
    return generateRandomString(length, characters);
}
