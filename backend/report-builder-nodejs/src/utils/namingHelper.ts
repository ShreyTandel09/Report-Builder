export function capitalizeWords(str?: string): string {
    if (!str || typeof str !== 'string') return '';

    return str
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}


export function toUnderscore(str?: string): string {
    if (!str || typeof str !== 'string') return '';
    return str.toLowerCase().replace(/\s+/g, '_');
}
