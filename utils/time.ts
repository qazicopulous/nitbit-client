
export function timeAgo(dateString: string): string {
    const inputDate = toDate(dateString)
    return timeAgoDate(inputDate);
}

export function timeAgoDate(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();

    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
        return `${years} year${years > 1 ? 's' : ''} ago`;
    } else if (months > 0) {
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (seconds > 0) {
        return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    } else {
        return "No date provided"
    }
}

export function toDate(dateString: string) {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day);
}
